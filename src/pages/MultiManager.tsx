import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Users, Plus, Trash2, Settings, Activity, Shield, Server,
  Wifi, WifiOff, Eye, EyeOff, RefreshCw, Copy, CheckCircle,
  AlertTriangle, UserPlus, Monitor, Database, Link2
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────
interface ManagedAccount {
  id: string;
  owner: string;
  type: 'mt4' | 'mt5' | 'exchange' | 'fix';
  label: string;
  server: string;
  login: string;
  password: string;
  enabled: boolean;
  connected: boolean;
  balance: number;
  equity: number;
  margin: number;
  leverage: string;
  openTrades: number;
  pnl: number;
  lastSync: Date;
  permissions: string[];
  // Exchange-specific
  exchange?: string;
  apiKey?: string;
  apiSecret?: string;
  subAccount?: string;
  // FIX-specific
  senderCompId?: string;
  targetCompId?: string;
  fixVersion?: string;
  fixPort?: number;
}

interface AccountGroup {
  id: string;
  name: string;
  accounts: string[];
  copyTrading: boolean;
  riskMultiplier: number;
}

const MOCK_ACCOUNTS: ManagedAccount[] = [
  { id:'1', owner:'Ahmad Rizky', type:'mt5', label:'MT5 Main', server:'ICMarkets-Live05', login:'51234567', password:'••••••••', enabled:true, connected:true, balance:25400, equity:26180, margin:4200, leverage:'1:500', openTrades:5, pnl:780, lastSync:new Date(), permissions:['trade','read','withdraw'] },
  { id:'2', owner:'Ahmad Rizky', type:'mt4', label:'MT4 Scalping', server:'Exness-Real14', login:'41234567', password:'••••••••', enabled:true, connected:true, balance:8500, equity:8320, margin:1200, leverage:'1:1000', openTrades:3, pnl:-180, lastSync:new Date(), permissions:['trade','read'] },
  { id:'3', owner:'Budi Santoso', type:'mt5', label:'MT5 Swing', server:'Pepperstone-Live02', login:'52345678', password:'••••••••', enabled:true, connected:false, balance:42000, equity:42000, margin:0, leverage:'1:200', openTrades:0, pnl:0, lastSync:new Date(Date.now()-600000), permissions:['trade','read'] },
  { id:'4', owner:'Budi Santoso', type:'exchange', label:'Binance Futures', server:'binance.com', login:'budi@email.com', password:'••••••••', enabled:true, connected:true, balance:15600, equity:16100, margin:3400, leverage:'20x', openTrades:4, pnl:500, lastSync:new Date(), exchange:'Binance', apiKey:'Bx7k...9mQ2', apiSecret:'••••••••', permissions:['trade','read'] },
  { id:'5', owner:'Siti Nurhaliza', type:'exchange', label:'Bybit Spot', server:'bybit.com', login:'siti@email.com', password:'••••••••', enabled:true, connected:true, balance:9800, equity:10200, margin:0, leverage:'—', openTrades:2, pnl:400, lastSync:new Date(), exchange:'Bybit', apiKey:'By3x...kL9', apiSecret:'••••••••', permissions:['trade','read'] },
  { id:'6', owner:'Siti Nurhaliza', type:'fix', label:'FIX LMAX', server:'fix.lmax.com', login:'SITI_PROD', password:'••••••••', enabled:false, connected:false, balance:50000, equity:50000, margin:0, leverage:'1:100', openTrades:0, pnl:0, lastSync:new Date(Date.now()-3600000), senderCompId:'SITI_PROD', targetCompId:'LMAX', fixVersion:'FIX.4.4', fixPort:443, permissions:['trade','read'] },
  { id:'7', owner:'Dian Prasetyo', type:'mt5', label:'MT5 Copy Master', server:'RoboForex-Pro', login:'53456789', password:'••••••••', enabled:true, connected:true, balance:120000, equity:125400, margin:18000, leverage:'1:300', openTrades:12, pnl:5400, lastSync:new Date(), permissions:['trade','read','withdraw'] },
  { id:'8', owner:'Dian Prasetyo', type:'exchange', label:'OKX Derivatives', server:'okx.com', login:'dian@email.com', password:'••••••••', enabled:true, connected:true, balance:28000, equity:29200, margin:6800, leverage:'50x', openTrades:6, pnl:1200, lastSync:new Date(), exchange:'OKX', apiKey:'Ok8m...nP4', apiSecret:'••••••••', permissions:['trade','read'] },
];

const MOCK_GROUPS: AccountGroup[] = [
  { id:'g1', name:'Master Copy Group', accounts:['1','2','7'], copyTrading:true, riskMultiplier:1.0 },
  { id:'g2', name:'Crypto Basket', accounts:['4','5','8'], copyTrading:false, riskMultiplier:0.5 },
];

// ─── Component ──────────────────────────────────────────
const MultiManager = () => {
  const [accounts, setAccounts] = useState<ManagedAccount[]>(MOCK_ACCOUNTS);
  const [groups, setGroups] = useState<AccountGroup[]>(MOCK_GROUPS);
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({ owner:'', type:'mt5' as const, label:'', server:'', login:'', password:'' });

  const owners = [...new Set(accounts.map(a => a.owner))];

  const filtered = accounts.filter(a => {
    return (selectedOwner === 'all' || a.owner === selectedOwner) && (selectedType === 'all' || a.type === selectedType);
  });

  const totalBalance = accounts.reduce((s,a) => s + a.balance, 0);
  const totalEquity = accounts.reduce((s,a) => s + a.equity, 0);
  const totalPnl = accounts.reduce((s,a) => s + a.pnl, 0);
  const connectedCount = accounts.filter(a => a.connected).length;

  const togglePassword = (id: string) => setShowPasswords(p => ({...p, [id]: !p[id]}));

  const toggleAccount = (id: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? {...a, enabled: !a.enabled} : a));
  };

  const reconnect = (id: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? {...a, connected: true, lastSync: new Date()} : a));
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addAccount = () => {
    if (!newAccount.owner || !newAccount.label) return;
    const acc: ManagedAccount = {
      id: `new-${Date.now()}`,
      ...newAccount,
      enabled: true,
      connected: false,
      balance: 0,
      equity: 0,
      margin: 0,
      leverage: '1:100',
      openTrades: 0,
      pnl: 0,
      lastSync: new Date(),
      permissions: ['trade','read'],
    };
    setAccounts(prev => [...prev, acc]);
    setShowAddForm(false);
    setNewAccount({ owner:'', type:'mt5', label:'', server:'', login:'', password:'' });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'mt4': case 'mt5': return <Monitor className="w-4 h-4" />;
      case 'exchange': return <Database className="w-4 h-4" />;
      case 'fix': return <Link2 className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string,string> = {
      mt4: 'bg-[hsl(200,60%,20%)] text-[hsl(200,70%,65%)] border-[hsl(200,50%,30%)]',
      mt5: 'bg-[hsl(260,40%,20%)] text-[hsl(260,60%,70%)] border-[hsl(260,40%,35%)]',
      exchange: 'bg-[hsl(45,60%,15%)] text-[hsl(45,80%,60%)] border-[hsl(45,50%,25%)]',
      fix: 'bg-[hsl(0,40%,18%)] text-[hsl(0,60%,65%)] border-[hsl(0,40%,30%)]',
    };
    return <Badge className={`text-[10px] border ${colors[type] || ''}`}>{type.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            Multi-Manager Account
          </h1>
          <p className="text-sm text-muted-foreground">Manage multiple MT4/5, Exchange & FIX accounts across traders</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[hsl(120,40%,35%)] text-[hsl(120,50%,55%)]">
            <Activity className="w-3 h-3 mr-1" /> {connectedCount}/{accounts.length} Connected
          </Badge>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Accounts</p>
          <p className="text-2xl font-bold text-foreground">{accounts.length}</p>
          <p className="text-xs text-muted-foreground">{owners.length} traders</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold text-foreground">${totalBalance.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Total Equity</p>
          <p className="text-2xl font-bold text-foreground">${totalEquity.toLocaleString()}</p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Open P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-[hsl(120,50%,50%)]' : 'text-destructive'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
          </p>
        </Card>
        <Card className="p-3 border-border bg-card">
          <p className="text-xs text-muted-foreground">Open Trades</p>
          <p className="text-2xl font-bold text-primary">{accounts.reduce((s,a) => s + a.openTrades, 0)}</p>
        </Card>
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <Card className="p-4 border-primary/30 bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> New Account</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Input placeholder="Owner name" value={newAccount.owner} onChange={e => setNewAccount(p => ({...p, owner: e.target.value}))} />
            <select value={newAccount.type} onChange={e => setNewAccount(p => ({...p, type: e.target.value as any}))} className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground">
              <option value="mt4">MT4</option>
              <option value="mt5">MT5</option>
              <option value="exchange">Exchange</option>
              <option value="fix">FIX</option>
            </select>
            <Input placeholder="Label" value={newAccount.label} onChange={e => setNewAccount(p => ({...p, label: e.target.value}))} />
            <Input placeholder="Server" value={newAccount.server} onChange={e => setNewAccount(p => ({...p, server: e.target.value}))} />
            <Input placeholder="Login" value={newAccount.login} onChange={e => setNewAccount(p => ({...p, login: e.target.value}))} />
            <div className="flex gap-2">
              <Input placeholder="Password" type="password" value={newAccount.password} onChange={e => setNewAccount(p => ({...p, password: e.target.value}))} />
              <Button onClick={addAccount} size="sm"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)} className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground">
          <option value="all">All Traders</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground">
          <option value="all">All Types</option>
          <option value="mt4">MetaTrader 4</option>
          <option value="mt5">MetaTrader 5</option>
          <option value="exchange">Exchange</option>
          <option value="fix">FIX Protocol</option>
        </select>
        <Button variant="outline" size="sm" onClick={() => setAccounts(prev => prev.map(a => ({...a, connected: true, lastSync: new Date()})))}>
          <RefreshCw className="w-4 h-4 mr-2" /> Reconnect All
        </Button>
      </div>

      {/* Tabs: By Owner */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="groups">Account Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filtered.map(acc => (
            <Card key={acc.id} className={`p-4 border-border bg-card ${!acc.enabled ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getTypeIcon(acc.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-foreground">{acc.label}</span>
                      {getTypeBadge(acc.type)}
                      <Badge variant="outline" className="text-[10px]">{acc.owner}</Badge>
                      {acc.connected ? (
                        <Badge className="bg-[hsl(120,30%,18%)] text-[hsl(120,50%,55%)] border border-[hsl(120,30%,30%)] text-[10px]"><Wifi className="w-3 h-3 mr-1" />Connected</Badge>
                      ) : (
                        <Badge className="bg-[hsl(0,30%,18%)] text-[hsl(0,50%,55%)] border border-[hsl(0,30%,30%)] text-[10px]"><WifiOff className="w-3 h-3 mr-1" />Disconnected</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-1 text-xs mt-2">
                      <div><span className="text-muted-foreground">Server:</span> <span className="text-foreground">{acc.server}</span></div>
                      <div><span className="text-muted-foreground">Login:</span> <span className="text-foreground font-mono">{acc.login}</span></div>
                      <div>
                        <span className="text-muted-foreground">Password:</span>{' '}
                        <span className="text-foreground font-mono">{showPasswords[acc.id] ? 'secret123' : '••••••••'}</span>
                        <button onClick={() => togglePassword(acc.id)} className="ml-1 text-muted-foreground hover:text-foreground">
                          {showPasswords[acc.id] ? <EyeOff className="w-3 h-3 inline" /> : <Eye className="w-3 h-3 inline" />}
                        </button>
                      </div>
                      <div><span className="text-muted-foreground">Balance:</span> <span className="text-foreground font-mono">${acc.balance.toLocaleString()}</span></div>
                      <div><span className="text-muted-foreground">Equity:</span> <span className="text-foreground font-mono">${acc.equity.toLocaleString()}</span></div>
                      <div><span className="text-muted-foreground">Margin:</span> <span className="text-foreground font-mono">${acc.margin.toLocaleString()}</span></div>
                      <div>
                        <span className="text-muted-foreground">P&L:</span>{' '}
                        <span className={`font-mono font-bold ${acc.pnl >= 0 ? 'text-[hsl(120,50%,50%)]' : 'text-destructive'}`}>
                          {acc.pnl >= 0 ? '+' : ''}${acc.pnl.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <span className="text-muted-foreground">Leverage: <span className="text-foreground">{acc.leverage}</span></span>
                      <span className="text-muted-foreground">Open: <span className="text-foreground">{acc.openTrades}</span></span>
                      <span className="text-muted-foreground">Sync: <span className="text-foreground">{acc.lastSync.toLocaleTimeString()}</span></span>
                      <div className="flex gap-1">
                        {acc.permissions.map(p => (
                          <Badge key={p} variant="outline" className="text-[9px] px-1">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    {acc.type === 'exchange' && (
                      <div className="text-xs mt-1 text-muted-foreground">
                        Exchange: <span className="text-[hsl(45,80%,55%)]">{acc.exchange}</span> | API: <span className="font-mono">{acc.apiKey}</span>
                      </div>
                    )}
                    {acc.type === 'fix' && (
                      <div className="text-xs mt-1 text-muted-foreground">
                        {acc.fixVersion} | Sender: <span className="font-mono">{acc.senderCompId}</span> → Target: <span className="font-mono">{acc.targetCompId}</span> | Port: {acc.fixPort}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={acc.enabled} onCheckedChange={() => toggleAccount(acc.id)} />
                  {!acc.connected && (
                    <Button variant="outline" size="sm" onClick={() => reconnect(acc.id)}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAccount(acc.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {groups.map(group => (
            <Card key={group.id} className="p-4 border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground">{group.name}</h3>
                  <p className="text-xs text-muted-foreground">{group.accounts.length} accounts | Risk: {group.riskMultiplier}x</p>
                </div>
                <div className="flex items-center gap-2">
                  {group.copyTrading && <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Copy Trading</Badge>}
                  <Button variant="outline" size="sm"><Settings className="w-3 h-3" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {group.accounts.map(accId => {
                  const acc = accounts.find(a => a.id === accId);
                  if (!acc) return null;
                  return (
                    <div key={accId} className="flex items-center justify-between p-2 rounded bg-secondary/30 text-xs">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(acc.type)}
                        <span className="text-foreground font-medium">{acc.label}</span>
                        <span className="text-muted-foreground">({acc.owner})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">${acc.equity.toLocaleString()}</span>
                        {acc.connected ? <Wifi className="w-3 h-3 text-[hsl(120,50%,50%)]" /> : <WifiOff className="w-3 h-3 text-destructive" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiManager;
