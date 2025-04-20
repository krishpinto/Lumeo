"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Users, DollarSign, PlusCircle, ChevronRight } from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { useAuth } from "@/app/context/AuthContext"
import { getAuthCookie } from "@/lib/cookies"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const { currentUser, logout, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<
    {
      id: string
      eventTitle?: string
      eventType?: string
      eventDate?: string
      location?: string
      numberOfGuests?: number
      budget?: number
      createdAt?: any
    }[]
  >([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    const authCookie = getAuthCookie()

    // Redirect to login if not authenticated and not loading
    if (!loading && (!currentUser || !authCookie)) {
      router.push("/login")
    }
  }, [currentUser, loading, router])

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return

      try {
        const eventsQuery = query(collection(db, "events"), where("userId", "==", currentUser.uid))
        const querySnapshot = await getDocs(eventsQuery)
        const userEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setEvents(userEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Prevent rendering if not authenticated
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8 pt-17">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.displayName || "User"}! Manage your events here.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingEvents ? (
          Array(3)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-[220px] w-full rounded-xl" />)
        ) : events.length > 0 ? (
          events.map((event) => (
            <Link key={event.id} href={`/dashboard/${event.id}`} className="block group">
              <Card className="h-full transition-all hover:shadow-md group-hover:border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {event.eventTitle || "Untitled Event"}
                  </CardTitle>
                  <CardDescription>{event.eventType || "No type specified"}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.numberOfGuests !== undefined && (
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{event.numberOfGuests} guests</span>
                      </div>
                    )}
                    {event.budget !== undefined && (
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>${event.budget}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>No events found</CardTitle>
                <CardDescription>
                  You haven't created any events yet. Get started by creating your first event.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/dashboard/create">
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
  )
}
