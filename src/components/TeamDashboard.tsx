
import { useState, useMemo, FC } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from 'recharts';
import { DashboardData, Post, Founder } from '../types';
import { Modal } from './Modal';

// --- Icons ---
const ChartPieIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
const CheckCircleIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExclamationTriangleIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>;
const LightBulbIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.625a6.01 6.01 0 00-1.5-11.625m0 11.625a6.01 6.01 0 01-1.5-11.625m0 11.625c-3.313 0-6 2.687-6 6v5.25a2.25 2.25 0 002.25 2.25h8.5A2.25 2.25 0 0018 21v-5.25c0-3.313-2.687-6-6-6z" /></svg>;
const PencilIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const TrashIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.71c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const UsersIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.958 0m0 0a3.75 3.75 0 01-5.958 0M3 13.5g3.75 0 7.5 0M3 13.5V18c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-4.5m-13.5 0c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" /></svg>;


// --- Component Types ---
type TeamDashboardProps = {
    data: DashboardData;
    addPost: (text: string, type: 'win' | 'blocker', authorId: number) => void;
    updatePost: (post: {id: number, text: string, type: 'win' | 'blocker'}) => void;
    deletePost: (postId: number) => void;
    isSubmitting: boolean;
    loggedInUser: Founder;
};

type EditPostFormProps = { post: Post; onSave: (text: string, type: 'win' | 'blocker') => void; onCancel: () => void; isSubmitting: boolean; };
type PostFormProps = { loggedInUser: Founder; addPost: TeamDashboardProps['addPost']; isSubmitting: boolean; };

// --- Reusable Child Components ---
const EditPostForm: FC<EditPostFormProps> = ({ post, onSave, onCancel, isSubmitting }) => {
    const [text, setText] = useState(post.text);
    const [type, setType] = useState<'win' | 'blocker'>(post.type);
    const handleSubmit = (ev: React.FormEvent) => { ev.preventDefault(); onSave(text, type); };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={text} onChange={ev => setText(ev.target.value)} className="w-full bg-white border border-[#929A8A]/50 rounded-md p-3 text-[#1A1A1A] placeholder-[#929A8A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none transition" rows={4}></textarea>
            <div className="flex items-center justify-between mt-4">
                <select value={type} onChange={ev => setType(ev.target.value as 'win' | 'blocker')} className="bg-white border border-[#929A8A]/50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#C4FF00]">
                    <option value="win">✅ Win</option>
                    <option value="blocker">⚠️ Blocker</option>
                </select>
                <div className="space-x-2">
                    <button type="button" onClick={onCancel} className="bg-[#929A8A] hover:bg-opacity-90 text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition" disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="bg-[#004225] hover:bg-opacity-90 text-[#F5F4EF] font-bold py-2 px-4 rounded-md transition" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </form>
    );
};

const PostForm: FC<PostFormProps> = ({ loggedInUser, addPost, isSubmitting }) => {
    const [text, setText] = useState('');
    const [type, setType] = useState<'win' | 'blocker'>('win');
    const handleSubmit = (ev: React.FormEvent) => { ev.preventDefault(); if (!text.trim()) return; addPost(text, type, loggedInUser.id); setText(''); };
    
    return (
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-[#F5F4EF] rounded-xl border border-[#929A8A]/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><LightBulbIcon className="h-6 w-6 mr-2 text-[#004225]" /> Share an Update as {loggedInUser.name}</h3>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind? Landed a new deal? Facing a roadblock?" className="w-full bg-white border border-[#929A8A]/50 rounded-md p-3 text-[#1A1A1A] placeholder-[#929A8A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none transition" rows={3}></textarea>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <select value={type} onChange={e => setType(e.target.value as 'win' | 'blocker')} className="bg-white border border-[#929A8A]/50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#C4FF00]">
                    <option value="win">✅ Win</option>
                    <option value="blocker">⚠️ Blocker</option>
                </select>
                <button type="submit" className="w-full sm:w-auto bg-[#004225] hover:bg-opacity-90 text-[#F5F4EF] font-bold py-2 px-6 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!text.trim() || isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Update'}
                </button>
            </div>
        </form>
    );
};

const MonthlyMomentumChart: FC<{progress: number}> = ({ progress }) => {
    const radialData = [{ name: 'Month', value: Math.min(progress, 100) }];
    return (
        <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={180} endAngle={0} barSize={30}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: 'rgba(146, 154, 138, 0.3)' }} dataKey="value" angleAxisId={0} fill="#C4FF00" cornerRadius={15} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}% complete`} />
                <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-[#1A1A1A] text-4xl font-bold">{`${progress.toFixed(0)}%`}</text>
                <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="fill-[#929A8A] text-sm">of monthly goal</text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
}

// --- Main TeamDashboard Component ---
const TeamDashboard: FC<TeamDashboardProps> = ({ data, addPost, updatePost, deletePost, isSubmitting, loggedInUser }) => {
    const { totalTarget, totalMonths, currentMonth, founders, revenueEntries, posts, sprintStartYear, sprintStartMonth, secondaryMissions } = data;
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const getFounderName = (id: number) => founders.find(f => f.id === id)?.name || 'Unknown';
    const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    
    // --- Mission 1: Heuristiq (Services) ---
    const heuristiqRevenue = useMemo(() => revenueEntries.filter(e => e.source === 'Heuristiq').reduce((sum, entry) => sum + entry.amount, 0), [revenueEntries]);
    const heuristiqProgress = totalTarget > 0 ? (heuristiqRevenue / totalTarget) * 100 : 0;
    
    // --- Mission 2: Echodeck (Product) ---
    const echodeckMission = useMemo(() => secondaryMissions.find(m => m.name.toLowerCase().includes('echodeck')), [secondaryMissions]);
    const echodeckRevenue = useMemo(() => revenueEntries.filter(e => e.source === 'Echodeck').reduce((sum, entry) => sum + entry.amount, 0), [revenueEntries]);
    const echodeckCustomers = useMemo(() => revenueEntries.filter(e => e.source === 'Echodeck' && e.is_new_customer).length, [revenueEntries]);
    const echodeckArrProgress = echodeckMission && echodeckMission.target_arr > 0 ? (echodeckRevenue / echodeckMission.target_arr) * 100 : 0;
    
    const calculateMonthlyRevenue = (source: 'Heuristiq' | 'Echodeck') => {
        if (!sprintStartMonth || !sprintStartYear) return 0;
        const startDate = new Date(sprintStartYear, sprintStartMonth - 1, 1);
        startDate.setMonth(startDate.getMonth() + currentMonth - 1);
        const targetYear = startDate.getFullYear().toString();
        const targetMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
        return revenueEntries
            .filter(entry => {
                const [year, month] = entry.date.split('-');
                return year === targetYear && month === targetMonth && entry.source === source;
            })
            .reduce((sum, entry) => sum + entry.amount, 0);
    }
    
    const thisMonthHeuristiqRevenue = useMemo(() => calculateMonthlyRevenue('Heuristiq'), [revenueEntries, currentMonth, sprintStartYear, sprintStartMonth]);
    const thisMonthHeuristiqTarget = totalTarget / totalMonths;
    const thisMonthHeuristiqProgress = thisMonthHeuristiqTarget > 0 ? (thisMonthHeuristiqRevenue / thisMonthHeuristiqTarget) * 100 : 0;
    
    const thisMonthEchodeckRevenue = useMemo(() => calculateMonthlyRevenue('Echodeck'), [revenueEntries, currentMonth, sprintStartYear, sprintStartMonth]);
    const thisMonthEchodeckTarget = echodeckMission ? echodeckMission.target_arr / totalMonths : 0;
    const thisMonthEchodeckProgress = thisMonthEchodeckTarget > 0 ? (thisMonthEchodeckRevenue / thisMonthEchodeckTarget) * 100 : 0;
    
    const totalContributionData = useMemo(() => founders.map(founder => ({ name: founder.name, value: revenueEntries.filter(entry => entry.founder_id === founder.id).reduce((sum, entry) => sum + entry.amount, 0) })).filter(d => d.value > 0), [founders, revenueEntries]);
    const COLORS = ['#004225', '#929A8A', '#006D3B'];
    const wins = useMemo(() => posts.filter(p => p.type === 'win'), [posts]);
    const blockers = useMemo(() => posts.filter(p => p.type === 'blocker'), [posts]);
    
    const handleDeletePost = (postId: number) => { if (window.confirm("Are you sure you want to delete this post?")) { deletePost(postId); } };
    const handleUpdatePost = (text: string, type: 'win' | 'blocker') => { if (editingPost) { updatePost({ ...editingPost, text, type }); setEditingPost(null); } };
    
    const PostItem = ({ post }: { post: Post }) => (
        <div className="bg-white p-3 rounded-lg animate-fade-in relative group border border-transparent hover:border-[#929A8A]/50">
            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {post.author_id === loggedInUser.id && (
                    <>
                        <button onClick={() => setEditingPost(post)} aria-label="Edit post" disabled={isSubmitting}><PencilIcon className="h-4 w-4 text-[#929A8A] hover:text-[#1A1A1A]" /></button>
                        <button onClick={() => handleDeletePost(post.id)} aria-label="Delete post" disabled={isSubmitting}><TrashIcon className="h-4 w-4 text-[#929A8A] hover:text-[#1A1A1A]" /></button>
                    </>
                )}
            </div>
            <p className="text-[#1A1A1A] pr-10">{post.text}</p>
            <p className="text-xs text-[#929A8A] mt-1">{`– ${getFounderName(post.author_id)} on ${new Date(post.timestamp).toLocaleDateString()}`}</p>
        </div>
    );
    
    return (
        <div className="space-y-8">
            <Modal isOpen={!!editingPost} onClose={() => setEditingPost(null)} title="Edit Update">
                {editingPost && <EditPostForm post={editingPost} onSave={handleUpdatePost} onCancel={() => setEditingPost(null)} isSubmitting={isSubmitting} />}
            </Modal>

            {/* --- MISSION 1: SERVICES REVENUE --- */}
            <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">{`Mission 1: Services Revenue ${formatCurrency(heuristiqRevenue)} / ${formatCurrency(totalTarget)}`}</h2>
                <div className="w-full bg-[#929A8A]/30 rounded-full h-6 relative overflow-hidden">
                    <div className="bg-[#C4FF00] h-6 rounded-full text-center text-[#1A1A1A] text-sm flex items-center justify-center font-bold transition-all duration-1000 ease-out" style={{ width: `${Math.min(heuristiqProgress, 100)}%` }}>
                        <span className="z-10">{`${heuristiqProgress.toFixed(1)}%`}</span>
                    </div>
                </div>
            </div>

            {/* --- MISSION 2: ECHODECK GROWTH --- */}
            {echodeckMission && (
                <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">{`Mission 2: Echodeck Growth`}</h2>
                            <p className="text-sm text-[#929A8A] -mt-2 mb-2">{echodeckMission.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                            <h3 className="text-lg font-bold text-[#004225] flex items-center gap-2 justify-end"><UsersIcon className="h-6 w-6"/> Customers</h3>
                            <p className="text-2xl font-bold">{echodeckCustomers} / {echodeckMission.target_customers}</p>
                        </div>
                    </div>
                    <div className="w-full bg-[#929A8A]/30 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-[#004225] h-6 rounded-full text-center text-[#F5F4EF] text-sm flex items-center justify-center font-bold transition-all duration-1000 ease-out" style={{ width: `${Math.min(echodeckArrProgress, 100)}%` }}>
                            <span className="z-10">{`${formatCurrency(echodeckRevenue)} / ${formatCurrency(echodeckMission.target_arr)} ARR (${echodeckArrProgress.toFixed(1)}%)`}</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-center">Services: This Month's Momentum</h3>
                    <MonthlyMomentumChart progress={thisMonthHeuristiqProgress} />
                </div>
                {echodeckMission && (
                    <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-center">Echodeck: This Month's Momentum</h3>
                         <MonthlyMomentumChart progress={thisMonthEchodeckProgress} />
                    </div>
                )}
            </div>

            <div className="lg:col-span-2 bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2"><ChartPieIcon className="h-6 w-6 text-[#004225]" /> Total Revenue Contribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={totalContributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                            {totalContributionData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />)}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #F5F4EF', borderRadius: '0.5rem' }} />
                        <Legend formatter={(value, entry) => <span className="text-[#1A1A1A]">{`${value}: ${formatCurrency(entry.payload?.value || 0)}`}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-[#004225] flex items-center gap-2"><CheckCircleIcon className="h-6 w-6" /> Key Wins</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 flex-grow">
                            {wins.length > 0 ? wins.map(post => <PostItem key={post.id} post={post} />) : <p className="text-[#929A8A] text-center py-8">No wins posted yet.</p>}
                        </div>
                    </div>
                    <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-[#1A1A1A] flex items-center gap-2"><ExclamationTriangleIcon className="h-6 w-6" /> Current Blockers</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 flex-grow">
                            {blockers.length > 0 ? blockers.map(post => <PostItem key={post.id} post={post} />) : <p className="text-[#929A8A] text-center py-8">No blockers posted yet.</p>}
                        </div>
                    </div>
                </div>
                <PostForm loggedInUser={loggedInUser} addPost={addPost} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
};

export default TeamDashboard;
