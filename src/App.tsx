
import { useState, useMemo, useCallback, useEffect } from 'react';
import { DashboardData, Founder } from './types';
import TeamDashboard from './components/TeamDashboard';
import IndividualDashboard from './components/IndividualDashboard';
import LoginScreen from './components/LoginScreen';
import { supabase } from './supabase';

const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState<Founder | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedViewId, setSelectedViewId] = useState<number | 'team'>('team');

    const refreshData = useCallback(async () => {
        if (!loggedInUser) return; // Don't fetch if not logged in
        setIsLoading(true);
        try {
            const [configRes, foundersRes, revenueRes, postsRes] = await Promise.all([
                supabase.from('config').select('*'),
                supabase.from('founders').select('*'),
                supabase.from('revenue').select('*'),
                supabase.from('posts').select('*')
            ]);

            if (configRes.error) throw new Error(`Config fetch failed: ${configRes.error.message}`);
            if (foundersRes.error) throw new Error(`Founders fetch failed: ${foundersRes.error.message}`);
            if (revenueRes.error) throw new Error(`Revenue fetch failed: ${revenueRes.error.message}`);
            if (postsRes.error) throw new Error(`Posts fetch failed: ${postsRes.error.message}`);

            const configData = configRes.data.reduce((acc, { key, value }) => ({ ...acc, [key]: Number(value) || value }), {} as any);
            
            const sprintStartDate = new Date(configData.sprintStartYear, configData.sprintStartMonth - 1, 1);
            const today = new Date();
            const monthDiff = (today.getFullYear() - sprintStartDate.getFullYear()) * 12 + (today.getMonth() - sprintStartDate.getMonth()) + 1;
            const currentMonth = Math.max(1, monthDiff);

            const data: DashboardData = {
                ...configData,
                founders: foundersRes.data,
                revenueEntries: revenueRes.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                posts: postsRes.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
                currentMonth: currentMonth
            };
            setDashboardData(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to load data:', err);
            setError(`Error fetching data: ${err.message}. Please check your Supabase connection and table setup.`);
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    }, [loggedInUser]);

    // This effect handles fetching data AFTER a user logs in.
    useEffect(() => {
        if (loggedInUser) {
            refreshData();
            setSelectedViewId(loggedInUser.id); // Default to the logged-in user's view
        }
    }, [loggedInUser, refreshData]);

    const runMutation = async (mutation: PromiseLike<any>) => {
        setIsSubmitting(true);
        try {
            const { error } = await mutation;
            if (error) throw error;
            await refreshData();
        } catch (err: any) {
            console.error('Mutation failed:', err);
            alert(`An error occurred: ${err.message}`);
            setIsSubmitting(false);
        }
    };

    const addPost = useCallback((postText: string, type: 'win' | 'blocker', author_id: number) => {
        runMutation(supabase.from('posts').insert({ author_id, text: postText, type }));
    }, []);
    
    const updatePost = useCallback((updatedPost: {id: number, text: string, type: 'win' | 'blocker'}) => {
        runMutation(supabase.from('posts').update({ text: updatedPost.text, type: updatedPost.type }).eq('id', updatedPost.id));
    }, []);
    
    const deletePost = useCallback((postId: number) => {
        runMutation(supabase.from('posts').delete().eq('id', postId));
    }, []);
    
    const addRevenueEntry = useCallback((entry: { founder_id: number; amount: number; date: string; }) => {
        runMutation(supabase.from('revenue').insert(entry));
    }, []);
    
    const updateRevenueEntry = useCallback((updatedEntry: {id: number, amount: number, date: string}) => {
        runMutation(supabase.from('revenue').update({ amount: updatedEntry.amount, date: updatedEntry.date }).eq('id', updatedEntry.id));
    }, []);
    
    const deleteRevenueEntry = useCallback((entryId: number) => {
        runMutation(supabase.from('revenue').delete().eq('id', entryId));
    }, []);
    
    const handleLogout = () => {
        setLoggedInUser(null);
        setDashboardData(null);
        setSelectedViewId('team');
    };

    const selectedFounder = useMemo(() => dashboardData?.founders.find(f => f.id === selectedViewId), [selectedViewId, dashboardData?.founders]);
    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedViewId(e.target.value === 'team' ? 'team' : Number(e.target.value));

    if (!loggedInUser) {
        return <LoginScreen onLoginSuccess={setLoggedInUser} />;
    }

    if (isLoading && !dashboardData) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
                <div className="font-atkinson text-5xl font-bold italic text-[#C4FF00]">heuristiq</div>
                <h1 className="text-3xl font-bold tracking-tighter mt-2">Mission Control</h1>
                <p className="mt-8 text-xl animate-pulse">Loading Dashboard for {loggedInUser.name}...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
                <div className="font-atkinson text-5xl font-bold italic text-red-500">heuristiq</div>
                <h1 className="text-3xl font-bold tracking-tighter mt-2 text-red-600">Loading Error</h1>
                <p className="mt-4 text-lg text-red-700 max-w-2xl">{error}</p>
                <button onClick={handleLogout} className="mt-8 bg-red-600 text-white font-bold py-2 px-6 rounded-md">Logout</button>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <header className="mb-8 p-4 bg-[#004225] text-[#F5F4EF] backdrop-blur-sm rounded-xl shadow-lg flex justify-between items-center sticky top-4 z-50">
                <div className="flex items-center space-x-4">
                    <span className="font-atkinson text-3xl font-bold italic text-[#C4FF00]">heuristiq</span>
                    <h1 className="text-2xl font-bold tracking-tighter">Mission Control</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <select value={selectedViewId} onChange={handleViewChange} className="appearance-none bg-white/10 border border-white/20 rounded-md py-2 pl-4 pr-10 text-[#F5F4EF] focus:outline-none focus:ring-2 focus:ring-[#C4FF00] cursor-pointer">
                            <option value="team">Team View</option>
                            {dashboardData.founders.map((founder) => <option key={founder.id} value={founder.id}>{founder.name}</option>)}
                        </select>
                        <ChevronDownIcon className="h-5 w-5 text-[#F5F4EF]/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-[#F5F4EF] font-bold py-2 px-4 rounded-md transition duration-200">Logout</button>
                </div>
            </header>
            
            <main>
                {(selectedViewId === 'team' || !selectedFounder) ?
                    <TeamDashboard data={dashboardData} addPost={addPost} updatePost={updatePost} deletePost={deletePost} isSubmitting={isSubmitting} loggedInUser={loggedInUser} /> :
                    <IndividualDashboard founder={selectedFounder} allData={dashboardData} addRevenueEntry={addRevenueEntry} updateRevenueEntry={updateRevenueEntry} deleteRevenueEntry={deleteRevenueEntry} isSubmitting={isSubmitting} />}
            </main>

            <footer className="text-center mt-12 text-[#929A8A] text-sm">
                <p>Mission Control | Powering Founder Success</p>
            </footer>
        </div>
    );
};

export default App;
