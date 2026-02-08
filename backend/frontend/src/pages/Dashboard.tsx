import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PencilLine, Plus, Settings, TrendingUp, Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

function useTenantFromHost() {
  if (typeof window === "undefined") return { sub: "", root: "yourapp.com" };
  const host = window.location.host;
  const parts = host.split(".");
  if (parts.length > 2) return { sub: parts[0], root: parts.slice(1).join(".") };
  return { sub: "", root: host };
}


const DashboardPage = () => {
  const { user, logout } = useAuth();
  const hostInfo = useTenantFromHost();

  return (
    <div className="w-full bg-gray-100">
        <div className="min-h-screen mx-auto max-w-7xl  px-4 py-8">
      <div className="mb-6">
      <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your tenant’s content & activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Tenant: {hostInfo.sub || "(root)"}</Badge>
          <Button className="gap-2"><Plus className="h-4 w-4"/> New Post</Button>
          <Button variant="outline" className="gap-2"><Settings className="h-4 w-4"/> Settings</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
        <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><PencilLine className="h-4 w-4"/> Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Users2 className="h-4 w-4"/> Authors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 pending invites</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42.7k</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Recent posts table (light placeholder) */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1,2,3,4,5].map((i)=> (
                <TableRow key={i}>
                  <TableCell>Sample post #{i}</TableCell>
                  <TableCell><Badge variant={i%2?"secondary":"default"}>{i%2?"Draft":"Published"}</Badge></TableCell>
                  <TableCell>Priya Sharma</TableCell>
                  <TableCell>2025-10-12</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default DashboardPage;
