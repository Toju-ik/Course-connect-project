
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { StudyGroup } from '@/types/studyGroups';

interface GroupHeaderProps {
  group: StudyGroup;
  memberCount: number;
  onBack: () => void;
  onLeaveGroup: (groupId: string) => Promise<boolean>;
}

export const GroupHeader = ({ 
  group, 
  memberCount, 
  onBack, 
  onLeaveGroup 
}: GroupHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white z-10 border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{group.study_group_name}</h2>
            <p className="text-sm text-gray-500">{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onLeaveGroup(group.id)}
        >
          Leave Group
        </Button>
      </div>
    </div>
  );
};
