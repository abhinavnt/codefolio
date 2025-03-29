import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchNotifications, markAsRead } from "@/redux/features/NotificationSlice";

export function NotificationsDialog() {
  const dispatch = useAppDispatch();
  const notifications  = useAppSelector((state) => state.notifications.items);
  // const hasUnreadNotifications = notifications.some((notification) => !notification.read);
   console.log(notifications,"item");
   
  useEffect(() => {
    console.log('fetching from fetchnotification');
    
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
    // Optionally sync with backend
    // axios.put(`/api/notifications/${id}/read`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length>0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <ScrollArea className="h-[300px] pr-4">
            {notifications.length<0 ? (
              <p className="text-center py-8">Loading...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer ${
                    notification.read
                      ? "bg-muted"
                      : "bg-muted/80 border-l-2 border-primary"
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No notifications
              </p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}