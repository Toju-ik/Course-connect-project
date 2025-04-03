
import { StudyGroup } from '@/types/studyGroups';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, UserPlus, UserMinus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GroupsListProps {
  groups: StudyGroup[];
  myGroups: StudyGroup[];
  isLoading: boolean;
  onSelect: (group: StudyGroup) => void;
  onJoin: (groupId: string) => Promise<boolean>;
  onLeave: (groupId: string) => Promise<boolean>;
  groupMembers: Record<string, { id: string; student_id: string | null; full_name: string | null; avatar_url: string | null; }[]>;
}

export const GroupsList = ({
  groups,
  myGroups,
  isLoading,
  onSelect,
  onJoin,
  onLeave,
  groupMembers
}: GroupsListProps) => {
  const isGroupMember = (groupId: string) => {
    return myGroups.some(group => group.id === groupId);
  };

  const getMemberCount = (groupId: string) => {
    return groupMembers[groupId]?.length || 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading groups...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Users size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No study groups yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Create a new study group to start collaborating with other students.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold cursor-pointer hover:text-primary" onClick={() => onSelect(group)}>
              {group.study_group_name}
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              {group.description || 'No description provided.'}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              <span>{getMemberCount(group.id)} member{getMemberCount(group.id) !== 1 ? 's' : ''}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" size="sm" onClick={() => onSelect(group)}>
              View
            </Button>
            {isGroupMember(group.id) ? (
              <Button variant="destructive" size="sm" onClick={() => onLeave(group.id)}>
                <UserMinus className="h-4 w-4 mr-1" />
                Leave
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => onJoin(group.id)}>
                <UserPlus className="h-4 w-4 mr-1" />
                Join
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
