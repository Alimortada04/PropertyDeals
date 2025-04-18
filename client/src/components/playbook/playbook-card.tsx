import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export interface PlaybookResource {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  path?: string;
  audience: string[];
  isComingSoon?: boolean;
  updatedAt?: string;
  isTrending?: boolean;
}

interface PlaybookCardProps {
  resource: PlaybookResource;
}

export default function PlaybookCard({ resource }: PlaybookCardProps) {
  const {
    icon,
    title,
    description,
    path,
    isComingSoon,
    updatedAt,
    isTrending
  } = resource;

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-[#E9F5F0] text-[#09261E]">
            {icon}
          </div>
        </div>
        <CardTitle className="text-center text-xl font-heading text-[#09261E]">
          {title}
        </CardTitle>
        {isComingSoon && (
          <div className="flex justify-center mt-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
              Coming Soon
            </Badge>
          </div>
        )}
        {isTrending && (
          <div className="flex justify-center mt-2">
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              🔥 Trending
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
        {updatedAt && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Updated {updatedAt}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex justify-center">
        {isComingSoon ? (
          <Button 
            className="bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-not-allowed"
            disabled
          >
            Coming Soon
          </Button>
        ) : (
          path && (
            <Link href={path}>
              <Button className="bg-[#09261E] hover:bg-[#135341] text-white px-4 py-2 text-sm">
                View Resource
              </Button>
            </Link>
          )
        )}
      </CardFooter>
    </Card>
  );
}