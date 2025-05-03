"use client";

import type React from "react";
import { AlertCircleIcon, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  actionLabel: string;
  isLoading: boolean;
  isDestructive?: boolean;
  showWarning?: boolean;
  warningTitle?: string;
  warningDescription?: string;
  onConfirm: () => Promise<void>;
  trigger: React.ReactNode;
}

const ConfirmationDialog = ({
  title,
  description,
  actionLabel,
  isLoading,
  isDestructive = false,
  showWarning = false,
  warningTitle = "Warning",
  warningDescription = "This action cannot be undone.",
  onConfirm,
  trigger,
}: ConfirmationDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showWarning && (
          <Alert
            variant="destructive"
            className="mt-4"
          >
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>{warningTitle}</AlertTitle>
            <AlertDescription>{warningDescription}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {}}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={isDestructive ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                actionLabel
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
