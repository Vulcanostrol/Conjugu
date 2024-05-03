import {createClient} from "@/utils/supabase/server";

export async function DailyStat() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {data: statusData} = await supabase.from('sr-entries').select('status').eq('status', 'reviewing');
  if (!statusData) throw new Error('Spaced-repetition data could not be retrieved.');

  const {data: dueData} = await supabase.from('sr-entries').select('next_review').lte('next_review', new Date().toISOString());
  if (!dueData) throw new Error('Due cards could not be retrieved.');

  return (
    <div className="stats bg-primary text-primary-content">
      <div className="stat">
        <div className="stat-title">Cards due</div>
        <div className="stat-value">{dueData.length}</div>
        <div className="stat-actions">
          {dueData.length > 0 ? <a className="btn btn-sm btn-secondary" href="/review">
            Review
          </a> : <p className="btn btn-sm btn-disabled">
            Review
          </p>}
        </div>
      </div>
      <div className="stat">
        <div className="stat-figure text-primary-content">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div className="stat-title">Learned cards:</div>
        <div className="stat-value">{statusData.length}</div>
      </div>
    </div>
  );
}
