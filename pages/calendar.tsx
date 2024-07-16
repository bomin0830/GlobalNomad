import React, { useState } from 'react';
import ActivitySelector from '@/components/Calendar/ActivitySelector';
import Calendar from '@/components/Calendar/Calendar';
import SideNavigation from '@/components/SideNavigation/SideNavigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getMyActivityList } from '@/pages/api/myActivities/apimyActivities';
import { getMyActivityListResponse } from '@/pages/api/myActivities/apimyActivities.types';
import Spinner from '@/components/Spinner/Spinner';

export default function CalendarPage() {
  const [activityId, setActivityId] = useState<number | null>(null);

  const { data, error, isLoading } = useQuery<getMyActivityListResponse, Error>(
    {
      queryKey: ['myActivityList'],
      queryFn: () => getMyActivityList({}),
    }
  );

  const handleSelectActivity = (selectedActivityId: number) => {
    setActivityId(selectedActivityId);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const hasActivities = data && data.activities.length > 0;

  return (
    <div className="flex justify-center w-full mt-[72px] mb-12 gap-[24px] t:mt-[24px] t:gap-[16px]">
      <SideNavigation />
      <div className="flex flex-col w-[792px] gap-[24px] t:w-[429px] t:h-[556px] m:w-full m:h-[492px] m:pb-[210px]">
        <p className="text-[32px] font-bold">예약 현황</p>
        {hasActivities ? (
          <>
            <ActivitySelector
              onSelectActivity={handleSelectActivity}
              selectedActivityId={activityId}
            />
            {activityId && <Calendar activityId={activityId} />}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Image
              src="/icon/empty_reservation.svg"
              alt="등록된 체험이 없어요"
              width={240}
              height={240}
            />
            <span className="text-var-gray7 text-[24px] mt-4">
              등록된 체험이 없어요
            </span>
          </div>
        )}
      </div>
    </div>
  );
}