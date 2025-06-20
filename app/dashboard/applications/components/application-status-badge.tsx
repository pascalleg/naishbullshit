import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "../types/application"
import { CheckCircle, Clock, Eye, ListFilter, X } from "lucide-react"

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  // Define badge properties based on status
  const getBadgeProps = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          label: "Pending",
        }
      case "viewed":
        return {
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <Eye className="h-3.5 w-3.5 mr-1" />,
          label: "Viewed",
        }
      case "shortlisted":
        return {
          className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
          icon: <ListFilter className="h-3.5 w-3.5 mr-1" />,
          label: "Shortlisted",
        }
      case "accepted":
        return {
          className: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
          label: "Accepted",
        }
      case "rejected":
        return {
          className: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <X className="h-3.5 w-3.5 mr-1" />,
          label: "Rejected",
        }
      default:
        return {
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          label: "Unknown",
        }
    }
  }

  const { className, icon, label } = getBadgeProps(status)

  return (
    <Badge variant="outline" className={className}>
      <div className="flex items-center">
        {icon}
        {label}
      </div>
    </Badge>
  )
}
