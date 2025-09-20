import { useState, useEffect, useCallback } from 'react';
import {
    getAutoAnswers,
    getServicesPrices,
    getServiceInfo,
    getPropertyManagement,
    getOutstandingPayments,
    getSchedules,
    subscribeToSchedules,
    subscribeToOutstandingPayments,
    updateData,
    addData,
    deleteData,
    COLLECTIONS,
    createUser,
    signInUser,
    signOutUser,
    onAuthStateChanged,
    auth
} from '../utils/firebase.utils';

// Authentication hook
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((authUser) => {
            setUser(authUser);
            setLoading(false);
        }, (authError) => {
            setError(authError);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            await createUser(email, password);
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            await signInUser(email, password);
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await signOutUser();
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, signUp, signIn, signOut };
}

// Generic data hook with improved error handling
function useGenericData(fetchFunction, dependencies = []) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchFunction();
                if (isMounted) {
                    setData(result);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, dependencies);

    return { data, loading, error };
}

export function useAutoAnswers() {
    return useGenericData(getAutoAnswers);
}

export function useServicesPrices() {
    return useGenericData(getServicesPrices);
}

export function useServiceInfo() {
    return useGenericData(getServiceInfo);
}

export function usePropertyManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getPropertyManagement();
                if (isMounted) {
                    setData(result);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const addCompany = async (company) => {
        try {
            const newCompany = await addData(COLLECTIONS.PROPERTY_MANAGEMENT, company);
            setData(prev => [...prev, newCompany]);
            return newCompany;
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    const updateCompany = async (id, updates) => {
        try {
            const updatedCompany = await updateData(COLLECTIONS.PROPERTY_MANAGEMENT, id, updates);
            setData(prev => prev.map(company => company.id === id ? updatedCompany : company));
            return updatedCompany;
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    const deleteCompany = async (id) => {
        try {
            await deleteData(COLLECTIONS.PROPERTY_MANAGEMENT, id);
            setData(prev => prev.filter(company => company.id !== id));
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    return { data, loading, error, addCompany, updateCompany, deleteCompany };
}

export function useOutstandingPayments() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const setupSubscription = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Initial load
                const initialData = await getOutstandingPayments();
                if (isMounted) {
                    setData(initialData);
                }
                
                // Set up real-time updates
                const unsubscribeCallback = subscribeToOutstandingPayments((updatedData) => {
                    if (isMounted) {
                        setData(updatedData);
                    }
                });
                
                if (isMounted) {
                    setUnsubscribe(() => unsubscribeCallback);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                    setLoading(false);
                }
            }
        };

        setupSubscription();

        return () => {
            isMounted = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const toggleStatus = async (id) => {
        const payment = data.find(p => p.id === id);
        if (!payment) return;

        try {
            const newStatus = payment.status === 'PAID' ? 'OUTSTANDING' : 'PAID';
            await updateData(COLLECTIONS.OUTSTANDING_PAYMENTS, id, { status: newStatus });
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    return { data, loading, error, toggleStatus };
}

export function useSchedules() {
    const [data, setData] = useState({ dispatching: [], management: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const setupSubscription = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Initial load
                const initialData = await getSchedules();
                if (isMounted) {
                    setData(initialData);
                }
                
                // Set up real-time updates
                const unsubscribeCallback = subscribeToSchedules((updates) => {
                    if (isMounted) {
                        setData(prev => ({ ...prev, ...updates }));
                    }
                });
                
                if (isMounted) {
                    setUnsubscribe(() => unsubscribeCallback);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error);
                    setLoading(false);
                }
            }
        };

        setupSubscription();

        return () => {
            isMounted = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const updateSchedule = async (type, id, updates) => {
        try {
            const collection = type === 'dispatching' ? COLLECTIONS.DISPATCHING_SCHEDULE : COLLECTIONS.MANAGEMENT_SCHEDULE;
            await updateData(collection, id, updates);
        } catch (error) {
            setError(error);
            throw error;
        }
    };

    return { data, loading, error, updateSchedule };
}