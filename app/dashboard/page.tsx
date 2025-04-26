"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  PlusCircle,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { getAuthCookie } from "@/lib/cookies";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();
  interface Event {
    id: string;
    eventTitle?: string;
    eventType?: string;
    eventDate?: string;
    location?: string;
    numberOfGuests?: number;
    budget?: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const authCookie = getAuthCookie();

    // Redirect to login if not authenticated and not loading
    if (!loading && (!currentUser || !authCookie)) {
      router.push("/auth/login");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return;

      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(eventsQuery);
        const userEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-16 w-[350px]" />
        <div className="flex justify-between items-center w-full mb-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-12 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Prevent rendering if not authenticated
  }

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return "No date specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get initials from user display name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredEvents = events.filter((event) =>
    (event.eventTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventColorClass = (eventType: string | undefined) => {
    if (!eventType) return "border-sky-500 text-sky-500 bg-transparent";
    
    const type = eventType.toLowerCase();
    if (type.includes("party")) return "border-purple-500 text-purple-500 bg-transparent";
    if (type.includes("wedding") || type.includes("shaddi")) return "border-pink-500 text-pink-500 bg-transparent";
    if (type.includes("festival") || type.includes("reunion")) return "border-amber-500 text-amber-500 bg-transparent";
    if (type.includes("showcase") || type.includes("exhibition")) return "border-emerald-500 text-emerald-500 bg-transparent";
    if (type.includes("meeting") || type.includes("together")) return "border-blue-500 text-blue-500 bg-transparent";
    
    return "border-sky-500 text-sky-500 bg-transparent";
  };

  const getTimeLeft = (dateString: string | number | Date) => {
    if (!dateString) return null;
    
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Past event";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 30) return `${diffDays} days left`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-8 pt-4 px-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span>Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome back, {currentUser.displayName || "User"}! Manage your events here.
          </p>
        </div>
        <Button>
          <Link href="/dashboard/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      <div className=" rounded-xl p-4 shadow-sm border border-gray-900">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 bg-gray-50 border-gray-200"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingEvents ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
              ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden border-gray-900 transition-all hover:shadow-md hover:border-gray-500 group"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="transition-colors text-lg md:text-xl">
                      {event.eventTitle || "Untitled Event"}
                    </CardTitle>
                    <Badge className={`${getEventColorClass(event.eventType)}`}>
                      {event.eventType || "Event"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeLeft(event.eventDate || "")}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 text-white" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 text-white" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      {event.numberOfGuests !== undefined && (
                        <div className="flex items-center text-gray-600">
                          <Users className="mr-2 h-4 w-4 text-white " />
                          <span>{event.numberOfGuests} guests</span>
                        </div>
                      )}
                      {event.budget !== undefined && (
                        <div className="flex items-center text-gray-600">
                          <span>${event.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors group-hover:border-blue-200"
                  >
                    <Link href={`/dashboard/${event.id}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gray-100 p-4 rounded-full mb-4">
                    <PlusCircle className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle>No events found</CardTitle>
                  <CardDescription>
                    You haven't created any events yet. Get started by creating your first event.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/dashboard/create" className="flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Event
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}