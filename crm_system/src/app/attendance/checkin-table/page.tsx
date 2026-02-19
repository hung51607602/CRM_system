'use client'

import CustomSelect from '@/app/components/CustomSelect';
import { getLocationDisplay } from '@/utils/constants';
import { useCheckinLogic } from '@/hooks/useCheckinLogic';

export default function CheckinTablePage() {
    const {
        router,
        isSubmitting,
        activities,
        formData,
        memberValidation,
        handleChange,
        handleSubmit,
        isFormValid
    } = useCheckinLogic();

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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">簽到表格</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">使用表格形式進行快速補簽到（會自動扣除會員配額）</p>
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
                                        參加者姓名 <span className="text-red-500">*</span>
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        聯絡方式 <span className="text-red-500">*</span>
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/4">
                                        運動班選項 <span className="text-red-500">*</span>
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        地點
                                    </th>
                                    <th scope="col" className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 w-1/6">
                                        其他
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
                                            placeholder="輸入姓名"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                            required
                                        />
                                        {/* 會員验证状态 - 浮動顯示 */}
                                        {(formData.name.trim() && formData.contactInfo.trim()) && (
                                            <div className="absolute right-1 top-1 pointer-events-none">
                                                {memberValidation.isValidating ? (
                                                    <span className="text-blue-600 text-xs">●</span>
                                                ) : memberValidation.error ? (
                                                    <span className="text-red-600 text-xs" title={memberValidation.error}>❌</span>
                                                ) : memberValidation.member ? (
                                                    <span className="text-green-600 text-xs" title={`餘額: ${memberValidation.member.quota}`}>✅</span>
                                                ) : null}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12">
                                        <input
                                            type="text"
                                            name="contactInfo"
                                            value={formData.contactInfo}
                                            onChange={handleChange}
                                            placeholder="電話/郵箱"
                                            className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block"
                                            required
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12">
                                        <div className="h-full w-full relative">
                                            <select
                                                name="activityId"
                                                value={formData.activityId}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-full px-3 py-2 border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none block bg-transparent appearance-none cursor-pointer"
                                            >
                                                <option value="">請選擇運動班</option>
                                                {activities.map((activity) => (
                                                    <option key={activity._id} value={activity._id}>
                                                        {activity.activityName} - {activity.trainerName} - {getLocationDisplay(activity.location)} ({new Date(activity.startTime).toLocaleDateString('zh-CN')})
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Custom arrow for select */}
                                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-0 align-top h-12 bg-gray-50">
                                        <input
                                            type="text"
                                            value={formData.location}
                                            readOnly
                                            className="w-full h-full px-3 py-2 border-none bg-transparent text-gray-600 outline-none"
                                            placeholder=""
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
                                            disabled={!isFormValid || isSubmitting}
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
