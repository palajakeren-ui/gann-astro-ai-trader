import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Globe, 
  MapPin, 
  Save, 
  RotateCcw, 
  Star,
  Moon,
  Sun,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface TimezoneConfig {
  timezone: string;
  utcOffset: number;
  dstEnabled: boolean;
  autoDetect: boolean;
}

interface LocationConfig {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

interface AstrologyConfig {
  houseSystem: string;
  zodiacType: string;
  aspectOrbs: {
    conjunction: number;
    opposition: number;
    trine: number;
    square: number;
    sextile: number;
  };
  planets: {
    name: string;
    enabled: boolean;
    color: string;
  }[];
  locations: LocationConfig[];
}

const TIMEZONES = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC", offset: 0 },
  { label: "EST (Eastern Standard Time)", value: "America/New_York", offset: -5 },
  { label: "CST (Central Standard Time)", value: "America/Chicago", offset: -6 },
  { label: "MST (Mountain Standard Time)", value: "America/Denver", offset: -7 },
  { label: "PST (Pacific Standard Time)", value: "America/Los_Angeles", offset: -8 },
  { label: "GMT (Greenwich Mean Time)", value: "Europe/London", offset: 0 },
  { label: "CET (Central European Time)", value: "Europe/Paris", offset: 1 },
  { label: "EET (Eastern European Time)", value: "Europe/Helsinki", offset: 2 },
  { label: "IST (India Standard Time)", value: "Asia/Kolkata", offset: 5.5 },
  { label: "CST (China Standard Time)", value: "Asia/Shanghai", offset: 8 },
  { label: "JST (Japan Standard Time)", value: "Asia/Tokyo", offset: 9 },
  { label: "AEST (Australian Eastern)", value: "Australia/Sydney", offset: 10 },
  { label: "NZST (New Zealand)", value: "Pacific/Auckland", offset: 12 },
  { label: "WIB (Western Indonesia)", value: "Asia/Jakarta", offset: 7 },
  { label: "SGT (Singapore Time)", value: "Asia/Singapore", offset: 8 },
  { label: "HKT (Hong Kong Time)", value: "Asia/Hong_Kong", offset: 8 },
  { label: "MSK (Moscow Standard Time)", value: "Europe/Moscow", offset: 3 },
  { label: "GST (Gulf Standard Time)", value: "Asia/Dubai", offset: 4 },
];

const HOUSE_SYSTEMS = [
  { value: "placidus", label: "Placidus" },
  { value: "koch", label: "Koch" },
  { value: "whole_sign", label: "Whole Sign" },
  { value: "equal", label: "Equal House" },
  { value: "campanus", label: "Campanus" },
  { value: "regiomontanus", label: "Regiomontanus" },
  { value: "porphyry", label: "Porphyry" },
];

const DEFAULT_PLANETS = [
  { name: "Sun", enabled: true, color: "#FFD700" },
  { name: "Moon", enabled: true, color: "#C0C0C0" },
  { name: "Mercury", enabled: true, color: "#87CEEB" },
  { name: "Venus", enabled: true, color: "#FF69B4" },
  { name: "Mars", enabled: true, color: "#FF4500" },
  { name: "Jupiter", enabled: true, color: "#FFA500" },
  { name: "Saturn", enabled: true, color: "#8B4513" },
  { name: "Uranus", enabled: true, color: "#00CED1" },
  { name: "Neptune", enabled: true, color: "#4169E1" },
  { name: "Pluto", enabled: true, color: "#800080" },
  { name: "North Node", enabled: true, color: "#228B22" },
  { name: "Chiron", enabled: false, color: "#808080" },
];

const DEFAULT_LOCATIONS: LocationConfig[] = [
  { name: "New York Stock Exchange", latitude: 40.7128, longitude: -74.0060, altitude: 10 },
  { name: "London Stock Exchange", latitude: 51.5074, longitude: -0.1278, altitude: 11 },
  { name: "Tokyo Stock Exchange", latitude: 35.6762, longitude: 139.6503, altitude: 40 },
];

const TimezoneAstrologyConfig = () => {
  const [timezoneConfig, setTimezoneConfig] = useState<TimezoneConfig>({
    timezone: "UTC",
    utcOffset: 0,
    dstEnabled: true,
    autoDetect: true,
  });

  const [astrologyConfig, setAstrologyConfig] = useState<AstrologyConfig>({
    houseSystem: "placidus",
    zodiacType: "tropical",
    aspectOrbs: {
      conjunction: 8,
      opposition: 8,
      trine: 8,
      square: 7,
      sextile: 6,
    },
    planets: DEFAULT_PLANETS,
    locations: DEFAULT_LOCATIONS,
  });

  const [newLocation, setNewLocation] = useState<LocationConfig>({
    name: "",
    latitude: 0,
    longitude: 0,
    altitude: 0,
  });

  const [yamlConfig, setYamlConfig] = useState<string>(`# Astrology Configuration YAML
# Location Settings for Market Analysis

locations:
  - name: "New York Stock Exchange"
    latitude: 40.7128
    longitude: -74.0060
    altitude: 10
    
  - name: "London Stock Exchange"
    latitude: 51.5074
    longitude: -0.1278
    altitude: 11
    
  - name: "Tokyo Stock Exchange"
    latitude: 35.6762
    longitude: 139.6503
    altitude: 40

# Aspect Orbs (degrees)
aspects:
  conjunction: 8
  opposition: 8
  trine: 8
  square: 7
  sextile: 6

# House System
house_system: placidus

# Zodiac Type
zodiac: tropical
`);

  const handleTimezoneChange = (value: string) => {
    const tz = TIMEZONES.find(t => t.value === value);
    if (tz) {
      setTimezoneConfig(prev => ({
        ...prev,
        timezone: value,
        utcOffset: tz.offset,
      }));
    }
  };

  const addLocation = () => {
    if (!newLocation.name.trim()) {
      toast.error("Please enter a location name");
      return;
    }
    
    setAstrologyConfig(prev => ({
      ...prev,
      locations: [...prev.locations, { ...newLocation }],
    }));
    
    setNewLocation({ name: "", latitude: 0, longitude: 0, altitude: 0 });
    toast.success(`Location "${newLocation.name}" added`);
  };

  const removeLocation = (index: number) => {
    const location = astrologyConfig.locations[index];
    setAstrologyConfig(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
    toast.success(`Location "${location.name}" removed`);
  };

  const togglePlanet = (planetName: string) => {
    setAstrologyConfig(prev => ({
      ...prev,
      planets: prev.planets.map(p => 
        p.name === planetName ? { ...p, enabled: !p.enabled } : p
      ),
    }));
  };

  const handleSaveConfig = () => {
    const config = {
      timezone: timezoneConfig,
      astrology: astrologyConfig,
    };
    localStorage.setItem('gann-quant-astro-config', JSON.stringify(config));
    toast.success("Configuration saved successfully!");
  };

  const handleExportYAML = () => {
    const blob = new Blob([yamlConfig], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `astrology-config-${new Date().toISOString().split('T')[0]}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("YAML configuration exported!");
  };

  const handleImportYAML = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYamlConfig(e.target.value);
  };

  const parseYAMLConfig = () => {
    try {
      // Simple YAML parsing for locations
      const locationMatches = yamlConfig.match(/- name: "([^"]+)"\s+latitude: ([\d.-]+)\s+longitude: ([\d.-]+)\s+altitude: ([\d.-]+)/g);
      
      if (locationMatches) {
        const locations: LocationConfig[] = [];
        locationMatches.forEach(match => {
          const nameMatch = match.match(/name: "([^"]+)"/);
          const latMatch = match.match(/latitude: ([\d.-]+)/);
          const lonMatch = match.match(/longitude: ([\d.-]+)/);
          const altMatch = match.match(/altitude: ([\d.-]+)/);
          
          if (nameMatch && latMatch && lonMatch && altMatch) {
            locations.push({
              name: nameMatch[1],
              latitude: parseFloat(latMatch[1]),
              longitude: parseFloat(lonMatch[1]),
              altitude: parseFloat(altMatch[1]),
            });
          }
        });
        
        if (locations.length > 0) {
          setAstrologyConfig(prev => ({ ...prev, locations }));
          toast.success(`Parsed ${locations.length} locations from YAML`);
        }
      }
    } catch (error) {
      toast.error("Failed to parse YAML configuration");
    }
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: timezoneConfig.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Timezone Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Timezone Configuration
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Select Timezone</Label>
              <select 
                value={timezoneConfig.timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-secondary/50">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Auto-detect Timezone</span>
              </div>
              <Switch 
                checked={timezoneConfig.autoDetect}
                onCheckedChange={(checked) => setTimezoneConfig(prev => ({ ...prev, autoDetect: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-secondary/50">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-warning" />
                <span className="text-sm">Daylight Saving Time (DST)</span>
              </div>
              <Switch 
                checked={timezoneConfig.dstEnabled}
                onCheckedChange={(checked) => setTimezoneConfig(prev => ({ ...prev, dstEnabled: checked }))}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Current Time</h4>
            <p className="text-3xl font-mono font-bold text-foreground mb-2">{currentTime}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{timezoneConfig.timezone}</Badge>
              <Badge variant="outline">UTC{timezoneConfig.utcOffset >= 0 ? '+' : ''}{timezoneConfig.utcOffset}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Astrology Configuration */}
      <Card className="p-6 border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Astrology Configuration
        </h2>

        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="locations" className="text-xs">Locations</TabsTrigger>
            <TabsTrigger value="planets" className="text-xs">Planets</TabsTrigger>
            <TabsTrigger value="aspects" className="text-xs">Aspects</TabsTrigger>
            <TabsTrigger value="yaml" className="text-xs">YAML Config</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Add New Location */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Add New Location
                </h4>
                <div className="space-y-2">
                  <Label className="text-xs">Location Name</Label>
                  <Input 
                    placeholder="e.g., Chicago Mercantile Exchange"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Latitude</Label>
                    <Input 
                      type="number"
                      step="0.0001"
                      placeholder="40.7128"
                      value={newLocation.latitude || ''}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Longitude</Label>
                    <Input 
                      type="number"
                      step="0.0001"
                      placeholder="-74.0060"
                      value={newLocation.longitude || ''}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Altitude (meters)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={newLocation.altitude || ''}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, altitude: parseFloat(e.target.value) || 0 }))}
                    className="text-sm"
                  />
                </div>
                <Button onClick={addLocation} className="w-full" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </div>

              {/* Saved Locations */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <h4 className="text-sm font-semibold text-foreground">Saved Locations</h4>
                {astrologyConfig.locations.map((loc, idx) => (
                  <div key={idx} className="p-3 rounded bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{loc.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeLocation(idx)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>Lat: {loc.latitude.toFixed(4)}</div>
                      <div>Lon: {loc.longitude.toFixed(4)}</div>
                      <div>Alt: {loc.altitude}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="planets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {astrologyConfig.planets.map((planet) => (
                <div 
                  key={planet.name}
                  className={`p-3 rounded-lg border ${planet.enabled ? 'bg-primary/10 border-primary/30' : 'bg-secondary/50 border-border'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: planet.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{planet.name}</span>
                    </div>
                    <Switch 
                      checked={planet.enabled}
                      onCheckedChange={() => togglePlanet(planet.name)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label className="text-sm">House System</Label>
                <select 
                  value={astrologyConfig.houseSystem}
                  onChange={(e) => setAstrologyConfig(prev => ({ ...prev, houseSystem: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
                >
                  {HOUSE_SYSTEMS.map(hs => (
                    <option key={hs.value} value={hs.value}>{hs.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Zodiac Type</Label>
                <select 
                  value={astrologyConfig.zodiacType}
                  onChange={(e) => setAstrologyConfig(prev => ({ ...prev, zodiacType: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
                >
                  <option value="tropical">Tropical</option>
                  <option value="sidereal">Sidereal</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aspects" className="space-y-4">
            <p className="text-sm text-muted-foreground">Configure orb degrees for each aspect type</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(astrologyConfig.aspectOrbs).map(([aspect, orb]) => (
                <div key={aspect} className="p-3 rounded bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm capitalize">{aspect}</Label>
                    <span className="text-sm font-mono text-foreground">{orb}°</span>
                  </div>
                  <Input 
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={orb}
                    onChange={(e) => setAstrologyConfig(prev => ({
                      ...prev,
                      aspectOrbs: {
                        ...prev.aspectOrbs,
                        [aspect]: parseFloat(e.target.value),
                      }
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="yaml" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Edit YAML configuration directly</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={parseYAMLConfig}>
                  <Upload className="w-4 h-4 mr-2" />
                  Parse YAML
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportYAML}>
                  <Download className="w-4 h-4 mr-2" />
                  Export YAML
                </Button>
              </div>
            </div>
            <Textarea 
              value={yamlConfig}
              onChange={handleImportYAML}
              className="font-mono text-sm min-h-[400px]"
              placeholder="Enter YAML configuration..."
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => toast.info("Configuration reset")}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TimezoneAstrologyConfig;
