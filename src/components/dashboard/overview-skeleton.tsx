import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function OverviewSkeleton() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className='h-4 w-24' />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className='h-8 w-16' />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
