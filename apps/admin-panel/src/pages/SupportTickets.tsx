import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from '../components/providers/toast-provider';
import { MessageSquare, User, Send } from 'lucide-react';

export default function SupportTickets() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [replyContent, setReplyContent] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await adminService.getAllTickets();
            setTickets(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await adminService.replyTicket(selectedTicket.id, replyContent, 'RESOLVED');
            toast.success("Sent", "Reply sent successfully.");
            setReplyContent('');
            loadTickets();
            const updated = await adminService.getAllTickets();
            const freshTicket = updated.find((t: any) => t.id === selectedTicket.id);
            setSelectedTicket(freshTicket);
        } catch (err) {
            toast.error("Error", "Failed to send reply");
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col h-screen overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
                        Support Tickets
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? <div className="p-4 text-center">Loading...</div> : tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedTicket?.id === ticket.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(ticket.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{ticket.subject}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{ticket.messages[0]?.content}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {ticket.user?.firstName?.[0]}
                                </div>
                                <span className="text-xs text-gray-600">{ticket.user?.company?.name || 'Unknown Company'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Detail View */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{selectedTicket.subject}</h2>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <User className="w-4 h-4 mr-1" />
                                    {selectedTicket.user?.firstName} {selectedTicket.user?.lastName} ({selectedTicket.user?.email})
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    {selectedTicket.status}
                                </span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedTicket.messages.map((msg: any) => (
                                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-4 shadow-sm ${msg.isAdmin ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <div className={`text-[10px] mt-2 opacity-70 ${msg.isAdmin ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className="bg-white p-4 border-t border-gray-200">
                            <div className="flex gap-2">
                                <textarea
                                    className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                                    placeholder="Type your reply here..."
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                />
                                <button
                                    onClick={handleReply}
                                    disabled={!replyContent.trim()}
                                    className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a ticket to view conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}
