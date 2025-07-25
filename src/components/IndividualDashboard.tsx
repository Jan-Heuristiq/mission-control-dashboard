import { useState, useMemo, FC } from 'react';
import { Founder, DashboardData, RevenueEntry } from '../types';
import { Modal } from './Modal';

// --- Icons ---
const PlusCircleIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PencilIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const TrashIcon = ({ className = '' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.71c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

// --- Component Types ---
type IndividualDashboardProps = {
    founder: Founder;
    allData: DashboardData;
    addRevenueEntry: (entry: { founder_id: number; amount: number; date: string; description?: string | null }) => void;
    updateRevenueEntry: (entry: Partial<RevenueEntry>) => void;
    deleteRevenueEntry: (entryId: number) => void;
    isSubmitting: boolean;
};

type StatCardProps = {
    label: string;
    value: React.ReactNode;
    subtext: string;
    className?: string;
}

type RevenueFormProps = {
    entry?: Partial<RevenueEntry>;
    onSave: (data: { amount: number; date: string; description: string | null }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
};

// --- Child Components ---
const StatCard: FC<StatCardProps> = ({ label, value, subtext, className = '' }) => (
    <div className={`bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg h-full flex flex-col justify-center ${className}`}>
        <h4 className="text-sm font-medium text-[#929A8A] uppercase tracking-wider">{label}</h4>
        <div className="text-4xl font-bold mt-2 text-[#1A1A1A]">{value}</div>
        <p className="text-[#929A8A] mt-1">{subtext}</p>
    </div>
);

const RevenueForm: FC<RevenueFormProps> = ({ entry, onSave, onCancel, isSubmitting }) => {
    const [amount, setAmount] = useState(entry?.amount || '');
    const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(entry?.description || '');

    const handleSubmit = (ev: React.FormEvent) => { 
        ev.preventDefault(); 
        onSave({ amount: Number(amount), date, description: description || null }); 
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-[#1A1A1A]">Amount (€)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 w-full bg-white border border-[#929A8A]/50 rounded-md p-2 text-[#1A1A1A] placeholder-[#929A8A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none" />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-[#1A1A1A]">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 w-full bg-white border border-[#929A8A]/50 rounded-md p-2 text-[#1A1A1A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#1A1A1A]">Short Name (Optional)</label>
                <input type="text" id="description" value={description || ''} onChange={e => setDescription(e.target.value)} placeholder="e.g., Project Phoenix MRR" className="mt-1 w-full bg-white border border-[#929A8A]/50 rounded-md p-2 text-[#1A1A1A] placeholder-[#929A8A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none" />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={onCancel} className="bg-[#929A8A] hover:bg-opacity-90 text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition" disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="bg-[#004225] hover:bg-opacity-90 text-[#F5F4EF] font-bold py-2 px-4 rounded-md transition" disabled={isSubmitting || !amount}>{isSubmitting ? 'Saving...' : 'Save'}</button>
            </div>
        </form>
    );
};

// --- Main IndividualDashboard Component ---
const IndividualDashboard: FC<IndividualDashboardProps> = ({ founder, allData, addRevenueEntry, updateRevenueEntry, deleteRevenueEntry, isSubmitting }) => {
    const { totalMonths, currentMonth, revenueEntries } = allData;
    const [modalState, setModalState] = useState<{ mode: 'closed' | 'add' | 'edit'; entry?: RevenueEntry }>({ mode: 'closed' });

    const personalRevenueEntries = useMemo(() => revenueEntries.filter(entry => entry.founder_id === founder.id), [revenueEntries, founder.id]);
    const personalRevenue = useMemo(() => personalRevenueEntries.reduce((sum, entry) => sum + entry.amount, 0), [personalRevenueEntries]);
    const personalProgress = founder.target > 0 ? (personalRevenue / founder.target) * 100 : 0;
    
    const { pacingPercentage, pacingColor } = useMemo(() => {
        const targetPacePerMonth = founder.target / totalMonths;
        const expectedRevenueToDate = targetPacePerMonth * currentMonth;
        const percentage = expectedRevenueToDate > 0 ? (personalRevenue / expectedRevenueToDate) * 100 : 0;
        let color = 'text-red-600';
        if (percentage >= 100) color = 'text-[#004225]';
        else if (percentage >= 80) color = 'text-amber-600';
        return { pacingPercentage: percentage, pacingColor: color };
    }, [founder.target, totalMonths, currentMonth, personalRevenue]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    
    const handleSaveRevenue = (data: { amount: number; date: string; description: string | null; }) => {
        if (modalState.mode === 'add') { addRevenueEntry({ founder_id: founder.id, ...data }); }
        else if (modalState.mode === 'edit' && modalState.entry) { updateRevenueEntry({ ...modalState.entry, ...data }); }
        setModalState({ mode: 'closed' });
    };

    const handleDeleteRevenue = (id: number) => { if (window.confirm("Are you sure you want to delete this revenue entry?")) { deleteRevenueEntry(id); } };
    
    return (
        <div className="space-y-8">
            <Modal isOpen={modalState.mode !== 'closed'} onClose={() => setModalState({ mode: 'closed' })} title={modalState.mode === 'add' ? 'Add Revenue Entry' : 'Edit Revenue Entry'}>
                <RevenueForm onSave={handleSaveRevenue} onCancel={() => setModalState({ mode: 'closed' })} entry={modalState.entry} isSubmitting={isSubmitting} />
            </Modal>

            <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg">
                <h2 className="text-3xl font-bold text-[#1A1A1A]">{`${founder.name}'s Cockpit`}</h2>
            </div>
            
            <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{`${founder.name}'s Target: ${formatCurrency(personalRevenue)} / ${formatCurrency(founder.target)}`}</h3>
                <div className="w-full bg-[#929A8A]/30 rounded-full h-6">
                    <div className="bg-[#004225] h-6 rounded-full text-center text-[#F5F4EF] text-sm flex items-center justify-center font-bold transition-all duration-1000 ease-out" style={{ width: `${Math.min(personalProgress, 100)}%` }}>
                        {`${personalProgress.toFixed(1)}%`}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                <StatCard label={`Pacing vs. ${totalMonths}-Month Goal`} value={<span className={pacingColor}>{`${pacingPercentage.toFixed(0)}%`}</span>} subtext={`of expected revenue for Month ${currentMonth}`} />
            </div>
            
            <div className="bg-[#F5F4EF] p-6 rounded-xl border border-[#929A8A]/50 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Revenue Log</h3>
                    <button onClick={() => setModalState({ mode: 'add' })} className="flex items-center bg-[#004225] hover:bg-opacity-90 text-[#F5F4EF] font-bold py-2 px-4 rounded-md transition duration-200" disabled={isSubmitting}>
                        <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Entry
                    </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {personalRevenueEntries.length > 0 ? personalRevenueEntries.map(entry => (
                        <div key={entry.id} className="bg-white p-3 rounded-lg flex justify-between items-center group">
                            <div>
                                <p className="font-bold text-[#1A1A1A]">{formatCurrency(entry.amount)}</p>
                                {entry.description && <p className="text-sm font-medium text-[#1A1A1A]">{entry.description}</p>}
                                <p className="text-sm text-[#929A8A]">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setModalState({ mode: 'edit', entry })} aria-label="Edit revenue entry" disabled={isSubmitting}><PencilIcon className="h-5 w-5 text-[#929A8A] hover:text-[#1A1A1A]" /></button>
                                <button onClick={() => handleDeleteRevenue(entry.id)} aria-label="Delete revenue entry" disabled={isSubmitting}><TrashIcon className="h-5 w-5 text-[#929A8A] hover:text-[#1A1A1A]" /></button>
                            </div>
                        </div>
                    )) : <p className="text-[#929A8A] text-center py-8">No revenue entries logged yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default IndividualDashboard;