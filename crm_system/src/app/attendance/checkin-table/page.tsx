'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckinTablePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Instead of useCheckinLogic which handles intricate checking and quotas,
    // we use a simple local state for this form.
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
        activity: '',
        location: '',
        other: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send plain text fields (allowing empty values since API will be updated)
                body: JSON.stringify({
                    name: formData.name,
                    contactInfo: formData.contactInfo,
                    location: formData.location,
                    activity: formData.activity,
                    other: formData.other
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ 記錄已成功添加！');
                // Optional: clear form or redirect
                // router.push('/attendance');
                setFormData({
                    name: '',
                    contactInfo: '',
                    activity: '',
                    location: '',
                    other: ''
                });
            } else {
                alert(`❌ 添加失敗：${data.error}`);
            }
        } catch {
            alert('❌ 提交失敗，請重試');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
            {/* 頁面標題 */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => router.push('/attendance')}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回列表
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">水吧</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">手動填寫表格記錄</p>
                </div>
            </div>

            {/* 表格容器 */}
            <div className="bg-white shadow-lg overflow-hidden border border-gray-300">
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        教班費
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        收入
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/4">
                                        每天總數
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        介紹費
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        REMARKS
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/12">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <tr>
                                    <td className="border border-gray-300 p-0 align-top relative h-12">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="輸入教班費"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12">
                                        <input
                                            type="text"
                                            name="contactInfo"
                                            value={formData.contactInfo}
                                            onChange={handleChange}
                                            placeholder="電話/郵箱"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12">
                                        <input
                                            type="text"
                                            name="activity"
                                            value={formData.activity}
                                            onChange={handleChange}
                                            placeholder="輸入每天總數"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12 bg-white">
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="輸入介紹費"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block bg-transparent"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12">
                                        <input
                                            type="text"
                                            name="other"
                                            value={formData.other}
                                            onChange={handleChange}
                                            placeholder=""
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-1 align-middle text-center">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-full flex items-center justify-center py-1 px-2 border border-transparent text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                                        >
                                            {isSubmitting ? '...' : '提交'}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
}
