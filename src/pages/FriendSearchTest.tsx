
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MobileLayout from '@/components/layouts/MobileLayout';

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  student_id: string | null;
  avatar_url: string | null;
};

const FriendSearchTest = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log('Starting to fetch all profiles...');
        setLoading(true);
        
        // Fetch all profiles without filtering by user ID
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, student_id, avatar_url')
          .order('full_name');
          
        if (error) {
          console.error('Error fetching profiles:', error);
          setError(error.message);
          return;
        }
        
        console.log('Profiles data returned from Supabase:', data);
        
        if (!data || data.length === 0) {
          console.log('No profiles found in the database');
          setProfiles([]);
          setFilteredProfiles([]);
          return;
        }
        
        // Filter out any records with errors
        const validProfiles = data.filter(profile => !('error' in profile)) as Profile[];
        console.log('Valid profiles after filtering:', validProfiles);
        console.log(`Found ${validProfiles.length} valid profiles`);
        
        setProfiles(validProfiles);
        setFilteredProfiles(validProfiles);
      } catch (err) {
        console.error('Unexpected error during profile fetch:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
        console.log('Profile fetch completed');
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfiles(profiles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = profiles.filter(profile => 
      (profile.full_name?.toLowerCase().includes(query) || 
       profile.student_id?.toLowerCase().includes(query) ||
       profile.username?.toLowerCase().includes(query))
    );
    
    console.log(`Search filter applied: "${searchQuery}" - Found ${filtered.length} matching profiles`);
    setFilteredProfiles(filtered);
  }, [searchQuery, profiles]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MobileLayout title="Friend Search Test" showBackButton>
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">Friend Search Test</h1>
        <p className="text-gray-600 mb-4">
          This page is for testing and debugging the friend search functionality.
        </p>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name, username or student ID..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <p className="mt-2 text-sm">Check console for more details.</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No profiles found {searchQuery ? `matching "${searchQuery}"` : ''}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Showing {filteredProfiles.length} of {profiles.length} profiles
            </p>
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-3">
                {filteredProfiles.map(profile => (
                  <Card key={profile.id} className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        {profile.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} />
                        ) : (
                          <AvatarFallback>
                            {profile.full_name
                              ? profile.full_name.substring(0, 2).toUpperCase()
                              : <User className="h-6 w-6" />
                            }
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.full_name || 'Unnamed User'}</p>
                        {profile.username && (
                          <p className="text-sm text-gray-500">@{profile.username}</p>
                        )}
                        {profile.student_id && (
                          <p className="text-sm text-gray-500">#{profile.student_id}</p>
                        )}
                        <p className="text-xs text-gray-400">ID: {profile.id}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="mt-6 text-sm bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Debug Information:</h3>
          <p>Total profiles: {profiles.length}</p>
          <p>Filtered profiles: {filteredProfiles.length}</p>
          <p>Search query: {searchQuery || '(empty)'}</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default FriendSearchTest;
