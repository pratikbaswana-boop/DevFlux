import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  MousePointerClick, 
  MessageSquare, 
  FileText, 
  Download, 
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock
} from "lucide-react";

interface DashboardStats {
  sessions: {
    total: number;
    uniqueVisitors: number;
    returningVisitors: number;
    avgDuration: number;
  };
  events: {
    total: number;
    byType: Record<string, number>;
  };
  feedback: {
    total: number;
    byReason: Record<string, number>;
  };
  audits: {
    total: number;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  browsers: Record<string, number>;
  utmSources: Record<string, number>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [timeFilter, setTimeFilter] = useState("7d");
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "events" | "feedback" | "audits">("overview");

  // Get secret from URL
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");

  // Redirect if no secret
  useEffect(() => {
    if (!secret) {
      setLocation("/");
    }
  }, [secret, setLocation]);

  // Fetch stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", secret, timeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/stats?secret=${secret}&timeFilter=${timeFilter}`);
      if (!res.ok) {
        if (res.status === 401) {
          setLocation("/");
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch stats");
      }
      return res.json();
    },
    enabled: !!secret,
    refetchInterval: 30000,
  });

  // Fetch sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/dashboard/sessions", secret, timeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/sessions?secret=${secret}&timeFilter=${timeFilter}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
    enabled: !!secret && activeTab === "sessions",
    refetchInterval: 30000,
  });

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/dashboard/events", secret, timeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/events?secret=${secret}&timeFilter=${timeFilter}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    enabled: !!secret && activeTab === "events",
    refetchInterval: 30000,
  });

  // Fetch feedback
  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/dashboard/feedback", secret, timeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/feedback?secret=${secret}&timeFilter=${timeFilter}`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
    enabled: !!secret && activeTab === "feedback",
    refetchInterval: 30000,
  });

  // Fetch audits
  const { data: audits, isLoading: auditsLoading } = useQuery({
    queryKey: ["/api/dashboard/audits", secret, timeFilter],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/audits?secret=${secret}&timeFilter=${timeFilter}`);
      if (!res.ok) throw new Error("Failed to fetch audits");
      return res.json();
    },
    enabled: !!secret && activeTab === "audits",
    refetchInterval: 30000,
  });

  const handleExport = (type: string) => {
    window.open(`/api/dashboard/export/${type}?secret=${secret}&timeFilter=${timeFilter}`, "_blank");
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!secret) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time analytics for DevFlux</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchStats()}
              className="border-white/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "sessions", "events", "feedback", "audits"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "" : "border-white/10"}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Sessions</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.sessions.total || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.sessions.uniqueVisitors || 0} unique visitors
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Events</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.events.total || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.keys(stats?.events.byType || {}).length} event types
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Feedback</CardTitle>
                  <MessageSquare className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.feedback.total || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Payment feedback entries</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Audit Requests</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.audits.total || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Form submissions</p>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - Device & Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-400">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-400" />
                        <span>Desktop</span>
                      </div>
                      <span className="font-bold">{stats?.devices.desktop || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-gray-400" />
                        <span>Mobile</span>
                      </div>
                      <span className="font-bold">{stats?.devices.mobile || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4 text-gray-400" />
                        <span>Tablet</span>
                      </div>
                      <span className="font-bold">{stats?.devices.tablet || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-400">Session Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Avg Duration</span>
                      </div>
                      <span className="font-bold">{formatDuration(stats?.sessions.avgDuration || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Returning</span>
                      </div>
                      <span className="font-bold">{stats?.sessions.returningVisitors || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-400">Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(stats?.topReferrers || []).slice(0, 5).map((ref, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 truncate max-w-[180px]">
                          <Globe className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{ref.referrer}</span>
                        </div>
                        <span className="font-bold">{ref.count}</span>
                      </div>
                    ))}
                    {(!stats?.topReferrers || stats.topReferrers.length === 0) && (
                      <p className="text-gray-500 text-sm">No referrer data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Types & UTM Sources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Events by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {Object.entries(stats?.events.byType || {})
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-[200px]">{type}</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      ))}
                    {Object.keys(stats?.events.byType || {}).length === 0 && (
                      <p className="text-gray-500 text-sm">No events recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">UTM Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {Object.entries(stats?.utmSources || {})
                      .sort(([, a], [, b]) => b - a)
                      .map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-[200px]">{source}</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      ))}
                    {Object.keys(stats?.utmSources || {}).length === 0 && (
                      <p className="text-gray-500 text-sm">No UTM data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sessions</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("sessions")} className="border-white/10">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead>Date</TableHead>
                        <TableHead>Visitor ID</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Browser</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>UTM Source</TableHead>
                        <TableHead>Referrer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(sessions || []).slice(0, 100).map((session: any) => (
                        <TableRow key={session.id} className="border-white/10">
                          <TableCell className="text-sm">{formatDate(session.createdAt)}</TableCell>
                          <TableCell className="text-sm font-mono truncate max-w-[100px]">{session.visitorId?.slice(0, 8)}...</TableCell>
                          <TableCell className="text-sm">{session.deviceType || "Unknown"}</TableCell>
                          <TableCell className="text-sm">{session.browser || "Unknown"}</TableCell>
                          <TableCell className="text-sm">{formatDuration(session.sessionDuration || 0)}</TableCell>
                          <TableCell className="text-sm">{session.utmSource || "Direct"}</TableCell>
                          <TableCell className="text-sm truncate max-w-[150px]">{session.referrer || "Direct"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(sessions || []).length > 100 && (
                    <p className="text-gray-500 text-sm mt-4">Showing first 100 of {sessions.length} sessions. Export CSV for full data.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Events</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("events")} className="border-white/10">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead>Date</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Page URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(events || []).slice(0, 100).map((event: any) => (
                        <TableRow key={event.id} className="border-white/10">
                          <TableCell className="text-sm">{formatDate(event.createdAt)}</TableCell>
                          <TableCell className="text-sm font-medium">{event.eventType}</TableCell>
                          <TableCell className="text-sm">{event.eventCategory || "-"}</TableCell>
                          <TableCell className="text-sm">{event.eventAction || "-"}</TableCell>
                          <TableCell className="text-sm truncate max-w-[150px]">{event.eventLabel || "-"}</TableCell>
                          <TableCell className="text-sm truncate max-w-[150px]">{event.pageUrl || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(events || []).length > 100 && (
                    <p className="text-gray-500 text-sm mt-4">Showing first 100 of {events.length} events. Export CSV for full data.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Feedback</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("feedback")} className="border-white/10">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {feedbackLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead>Date</TableHead>
                        <TableHead>Feedback Reason</TableHead>
                        <TableHead>Page URL</TableHead>
                        <TableHead>Referrer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(feedback || []).map((fb: any) => (
                        <TableRow key={fb.id} className="border-white/10">
                          <TableCell className="text-sm">{formatDate(fb.createdAt)}</TableCell>
                          <TableCell className="text-sm font-medium">{fb.feedbackReason}</TableCell>
                          <TableCell className="text-sm truncate max-w-[200px]">{fb.pageUrl || "-"}</TableCell>
                          <TableCell className="text-sm truncate max-w-[200px]">{fb.referrer || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(feedback || []).length === 0 && (
                    <p className="text-gray-500 text-sm mt-4">No feedback entries yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Audits Tab */}
        {activeTab === "audits" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Audit Requests</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport("audits")} className="border-white/10">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {auditsLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Team Size</TableHead>
                        <TableHead>Current Spend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(audits || []).map((audit: any) => (
                        <TableRow key={audit.id} className="border-white/10">
                          <TableCell className="text-sm">{formatDate(audit.createdAt)}</TableCell>
                          <TableCell className="text-sm font-medium">{audit.name}</TableCell>
                          <TableCell className="text-sm">{audit.email}</TableCell>
                          <TableCell className="text-sm">{audit.company}</TableCell>
                          <TableCell className="text-sm">{audit.teamSize}</TableCell>
                          <TableCell className="text-sm">{audit.currentSpend || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(audits || []).length === 0 && (
                    <p className="text-gray-500 text-sm mt-4">No audit requests yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Data refreshes automatically every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
