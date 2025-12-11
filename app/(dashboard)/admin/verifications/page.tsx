"use client";

import { useEffect, useState } from "react";
// import { format } from "date-fns"; // Removed dependency
import { Check, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import the new server actions
import { 
  getPendingVerifications, 
  approveVerificationAction, 
  rejectVerificationAction 
} from "@/app/actions/verify";

// --- Types ---
interface VerifyRequest {
  verifyUuid: string;
  targetType: "company" | "user" | "seller";
  targetId: string;
  status: string;
  submittedBy: number;
  createdAt: string; 
  verifyDocuments?: string;
}

export default function AdminVerificationsPage() {
  const [requests, setRequests] = useState<VerifyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. Fetch using Server Action
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getPendingVerifications();
    
    if (result.success) {
      setRequests(result.payload);
    } else {
      console.error(result.error);
      toast.error("Error fetching data", {
        description: result.error,
      });
    }
    setLoading(false);
  };

  // 2. Handle Approve using Server Action
  const handleApprove = async (uuid: string) => {
    setProcessingId(uuid);
    
    const result = await approveVerificationAction(uuid);

    if (result.success) {
      toast.success("Success", {
        description: "Verification request approved successfully.",
      });
      // Remove from list locally for instant feedback
      setRequests((prev) => prev.filter((req) => req.verifyUuid !== uuid));
    } else {
      toast.error("Error", {
        description: result.error,
      });
    }
    setProcessingId(null);
  };

  // 3. Handle Reject using Server Action
  const handleReject = async (uuid: string) => {
    const remarks = prompt("Enter rejection reason:");
    if (!remarks) return;

    setProcessingId(uuid);
    
    const result = await rejectVerificationAction(uuid, remarks);

    if (result.success) {
      toast.info("Rejected", {
        description: "Verification request rejected.",
      });
      // Remove from list locally
      setRequests((prev) => prev.filter((req) => req.verifyUuid !== uuid));
    } else {
      toast.error("Error", {
        description: result.error,
      });
    }
    setProcessingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pending Verifications</h1>
        <Button onClick={loadData} variant="outline" size="sm">
          Refresh List
        </Button>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>Admin Process</AlertTitle>
        <AlertDescription>
          Review the requests below. Approving a <strong>Company</strong> request
          will immediately active their account and allow them to start selling.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Request Queue</CardTitle>
          <CardDescription>
            Manage pending identity and business verification requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No pending verification requests found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Target ID (UUID)</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.verifyUuid}>
                    <TableCell>
                      <Badge
                        variant={req.targetType === "company" ? "default" : "secondary"}
                      >
                        {req.targetType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {req.targetId}
                    </TableCell>
                    <TableCell>
                      {req.verifyDocuments ? (
                        <span className="text-xs truncate max-w-[200px] block">
                          {req.verifyDocuments}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">No files</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("en-US", {
                            dateStyle: "long",
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(req.verifyUuid)}
                        disabled={processingId === req.verifyUuid}
                      >
                        {processingId === req.verifyUuid ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="sr-only">Reject</span>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(req.verifyUuid)}
                        disabled={processingId === req.verifyUuid}
                      >
                        {processingId === req.verifyUuid ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">Approve</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}