
import { useState } from 'react';
import { UserSearchResult } from '@/types/friends';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, UserPlus, Check, Clock } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSearchProps {
  onSearch: (query: string) => Promise<void>;
  onSendRequest: (userId: string) => Promise<boolean>;
  searchResults: UserSearchResult[];
  isSearching: boolean;
}

export const UserSearch = ({
  onSearch,
  onSendRequest,
  searchResults,
  isSearching
}: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    await onSearch(searchQuery);
  };
  
  const handleSendRequest = async (userId: string) => {
    try {
      setSending(userId);
      const success = await onSendRequest(userId);
      return success;
    } finally {
      setSending(null);
    }
  };

  const renderActionButton = (result: UserSearchResult) => {
    // Enhanced to show clearer status messages based on relationship
    if (result.relationshipStatus === 'friend') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          disabled
          className="bg-green-50 border-green-200 text-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Friends
        </Button>
      );
    } else if (result.relationshipStatus === 'outgoing_request') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          disabled
          className="bg-blue-50 border-blue-200 text-blue-700"
        >
          <Clock className="h-4 w-4 mr-1" />
          Request Sent
        </Button>
      );
    } else if (result.relationshipStatus === 'incoming_request') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          disabled
          className="bg-yellow-50 border-yellow-200 text-yellow-700"
        >
          <Clock className="h-4 w-4 mr-1" />
          Respond in Requests
        </Button>
      );
    } else {
      // No relationship, show Add Friend button
      return (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => handleSendRequest(result.id)}
          disabled={sending === result.id}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          {sending === result.id ? 'Sending...' : 'Add Friend'}
        </Button>
      );
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, username or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          type="submit" 
          variant="outline"
          disabled={isSearching || !searchQuery.trim()}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      {isSearching && (
        <div className="text-center py-4">
          <p>Searching...</p>
        </div>
      )}
      
      {searchResults.length > 0 && !isSearching && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <h3 className="text-sm font-medium">
              Found {searchResults.length} {searchResults.length === 1 ? 'person' : 'people'} matching "{searchQuery}"
            </h3>
          </div>
          <ScrollArea className="max-h-[60vh]">
            <div className="divide-y">
              {searchResults.map((result) => (
                <Card key={result.id} className="border-0 rounded-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          {result.avatar_url ? (
                            <AvatarImage src={result.avatar_url} />
                          ) : (
                            <AvatarFallback>
                              {result.full_name?.substring(0, 2).toUpperCase() || <User className="h-5 w-5" />}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{result.full_name || 'Unnamed User'}</p>
                          {result.username && (
                            <p className="text-xs text-gray-500">@{result.username}</p>
                          )}
                          {result.student_id && (
                            <p className="text-xs text-gray-500">#{result.student_id}</p>
                          )}
                        </div>
                      </div>
                      {renderActionButton(result)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-4 text-gray-500">
          No users found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};
