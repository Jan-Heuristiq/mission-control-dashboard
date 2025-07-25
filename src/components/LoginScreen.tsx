
import { useState, useEffect, FC } from 'react';
import { supabase } from '../supabase';
import { Founder } from '../types';

type LoginScreenProps = {
    onLoginSuccess: (user: Founder) => void;
};

// This specific type is for the dropdown list only.
// It prevents fetching sensitive data like access_key for all users.
type LoginFounder = {
    id: number;
    name: string;
};

const LoginScreen: FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [founders, setFounders] = useState<LoginFounder[]>([]);
    const [selectedFounderId, setSelectedFounderId] = useState<string>('');
    const [accessKey, setAccessKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFounders = async () => {
            setIsLoading(true);
            try {
                // Fetch ONLY the id and name for security and efficiency.
                const { data, error } = await supabase.from('founders').select('id, name');
                if (error) throw error;
                
                const founderList = data || [];
                setFounders(founderList);

                if (founderList.length > 0) {
                    setSelectedFounderId(String(founderList[0].id));
                }
            } catch (err: any) {
                setError(`Could not load founder list: ${err.message}. Please check your Supabase connection.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFounders();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFounderId || !accessKey) {
            setError('Please select your name and enter your access key.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Securely verify the selected ID and the entered access key against the database.
            // Supabase returns the full Founder object only on a successful match.
            const { data, error } = await supabase
                .from('founders')
                .select() // Selects all columns for the single matched user
                .eq('id', selectedFounderId)
                .eq('access_key', accessKey)
                .single();

            if (error || !data) {
                throw new Error('Invalid name or access key. Please try again.');
            }
            
            // On success, pass the full, verified user object up.
            onLoginSuccess(data);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#F5F4EF] p-4">
            <div className="w-full max-w-sm text-center">
                <div className="font-atkinson text-5xl font-bold italic text-[#C4FF00] mb-2">heuristiq</div>
                <h1 className="text-3xl font-bold tracking-tighter text-[#1A1A1A]">Mission Control</h1>
                <p className="text-[#929A8A] mt-2 mb-8">Please log in to continue.</p>
                
                <div className="bg-[#FFFEFB] p-8 rounded-2xl shadow-lg border border-[#929A8A]/30">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="founder" className="sr-only">Select your name</label>
                            <select
                                id="founder"
                                value={selectedFounderId}
                                onChange={(e) => setSelectedFounderId(e.target.value)}
                                className="w-full bg-white border border-[#929A8A]/50 rounded-md p-3 text-lg text-[#1A1A1A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none transition"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <option>Loading founders...</option>
                                ) : (
                                    founders.map((founder) => (
                                        <option key={founder.id} value={founder.id}>
                                            {founder.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="accessKey" className="sr-only">Access Key</label>
                            <input
                                type="password"
                                id="accessKey"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                placeholder="Your Secret Access Key"
                                className="w-full bg-white border border-[#929A8A]/50 rounded-md p-3 text-lg text-[#1A1A1A] placeholder-[#929A8A] focus:ring-2 focus:ring-[#C4FF00] focus:outline-none transition"
                                required
                            />
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        
                        <button
                            type="submit"
                            className="w-full bg-[#004225] hover:bg-opacity-90 text-[#F5F4EF] font-bold py-3 px-6 rounded-md transition duration-200 text-lg disabled:opacity-50 disabled:cursor-wait"
                            disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
