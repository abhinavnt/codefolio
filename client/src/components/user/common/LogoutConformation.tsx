import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  interface LogoutConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
  }
  
  export function LogoutConfirmationDialog({ isOpen, onClose, onConfirm }: LogoutConfirmationDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className=" hover:bg-emerald-600 hover:text-white" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-700" onClick={onConfirm}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  