
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyGroup } from '@/types/studyGroups';

interface GroupInfoProps {
  group: StudyGroup;
}

export const GroupInfo = ({ group }: GroupInfoProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {group.description || 'No description provided.'}
        </p>
        <p className="text-xs text-gray-500 mt-4">
          Created {formatDistanceToNow(new Date(group.created_at), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
};
