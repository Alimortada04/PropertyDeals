import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  MapPin,
  Tag
} from "lucide-react";

interface RepAboutProps {
  rep: any;
  stats: any;
}

export default function RepAbout({ rep, stats }: RepAboutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          About
        </CardTitle>
        <CardDescription>Professional background and specialties</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio section */}
        {rep.bio && (
          <div>
            <p className="text-sm md:text-base leading-relaxed">{rep.bio}</p>
          </div>
        )}
        
        {/* Specialties */}
        {rep.specialties && rep.specialties.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span>Specialties</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rep.specialties.map((specialty: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="rounded-md py-1 px-2"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Service areas */}
        {rep.areas && rep.areas.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Service Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rep.areas.map((area: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="rounded-md py-1 px-2 bg-muted"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience highlights */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {stats.dealsClosed && (
              <div>
                <div className="text-2xl font-bold">{stats.dealsClosed}</div>
                <div className="text-sm text-muted-foreground">Deals Closed</div>
              </div>
            )}
            
            {stats.reviewCount && (
              <div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-1">{parseFloat(stats.rating || "0").toFixed(1)}</span>
                  <span className="text-yellow-500">★</span>
                </div>
                <div className="text-sm text-muted-foreground">{stats.reviewCount} Reviews</div>
              </div>
            )}
            
            {rep.memberSince && (
              <div>
                <div className="text-2xl font-bold">
                  {new Date(rep.memberSince).getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">Member Since</div>
              </div>
            )}
            
            {stats.responseRate && (
              <div>
                <div className="text-2xl font-bold">{stats.responseRate}%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}