import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ServiceRequestDto {
    type: 'HIRE_ACCOUNTANT' | 'CONSULTATION' | 'TECHNICAL_SUPPORT';
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    message: string;
    contactPreference: 'EMAIL' | 'PHONE';
}

export const supportService = {
    createRequest: async (data: ServiceRequestDto) => {
        // In a real app, this would POST to /support/request
        // For now, we simulate a successful API call
        console.log("Submitting service request:", data);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return { success: true, message: "Request received" };
    }
};
