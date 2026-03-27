'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import QRCode from 'qrcode';
import { AVAILABLE_LOCATIONS } from '@/utils/constants';

// Interfaces moved from the page component
export interface Member {
  _id: string;
  username: string;
  memberName: string;
  phone: string;
  email: string;
  quota: number;
  isActive: boolean;
}

export interface Activity {
  _id: string;
  activityName: string;
  trainerId: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  isActive: boolean;
}

export interface CheckinFormData {
  name: string;
  contactInfo: string;
  location: string;
  activityId: string;
  activityName: string;
  other: string;
}

export interface MemberValidationState {
  isValidating: boolean;
  member: Member | null;
  error: string;
}

export function useCheckinLogic() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [formData, setFormData] = useState<CheckinFormData>({
    name: '',
    contactInfo: '',
    location: '',
    activityId: '',
    activityName: '',
    other: ''
  });
  const [memberValidation, setMemberValidation] = useState<MemberValidationState>({
    isValidating: false,
    member: null,
    error: ''
  });

  // QR Code states
  const [qrCode, setQrCode] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const response = await fetch('/api/activities');
      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
      }
    } catch {
      console.error('獲取活动列表失敗');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setAvailableLocations(AVAILABLE_LOCATIONS);
      } else if (user.role === 'trainer') {
        setAvailableLocations(user.locations || []);
      }
    }
    fetchActivities();
  }, [user]);

  // Validate Member
  const validateMember = async (name: string, contactInfo: string) => {
    if (!name.trim() || !contactInfo.trim()) {
      setMemberValidation({
        isValidating: false,
        member: null,
        error: ''
      });
      return;
    }

    setMemberValidation(prev => ({ ...prev, isValidating: true, error: '' }));

    try {
      const response = await fetch(`/api/accounts/validate-member?name=${encodeURIComponent(name)}&contact=${encodeURIComponent(contactInfo)}`);
      const result = await response.json();

      if (result.success && result.data) {
        const member = result.data;
        if (!member.isActive) {
          setMemberValidation({
            isValidating: false,
            member: null,
            error: '該會員帳戶已被禁用'
          });
        } else if (member.quota <= 0) {
          setMemberValidation({
            isValidating: false,
            member: member,
            error: '該會員配額不足，無法參加活動'
          });
        } else {
          setMemberValidation({
            isValidating: false,
            member: member,
            error: ''
          });
        }
      } else {
        setMemberValidation({
          isValidating: false,
          member: null,
          error: '找不到該會員記錄，請檢查姓名和收入是否正確'
        });
      }
    } catch {
      setMemberValidation({
        isValidating: false,
        member: null,
        error: '驗證會員信息時出錯，請重試'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'activityId') {
      const selectedActivity = activities.find(activity => activity._id === value);
      setFormData(prev => ({
        ...prev,
        activityId: value,
        activityName: selectedActivity?.activityName || '',
        location: selectedActivity?.location || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'name' || name === 'contactInfo') {
      // Create a temporary form state to validate with the latest value
      const tempFormData = { ...formData, [name]: value };
      
      // Debounce or just call it directly? Original code called it directly.
      // Ideally we should debounce, but sticking to original logic for now to ensure consistency behavior.
      // However, React state update is async, so using temp object.
      // Original code: const newFormData = { ...formData, [name]: value }; validateMember(...)
      
      // We need to pass the updated values to validateMember
      // But since we are updating state, we can't rely on formData immediately in a closure if we were to use useEffect, 
      // but here we are in the event handler.
      validateMember(
             name === 'name' ? value : formData.name,
             name === 'contactInfo' ? value : formData.contactInfo
      );
    }
  };

  const generateQrCode = async () => {
    setIsGeneratingQr(true);

    try {
      let qrData;

      if (formData.activityId && formData.activityName && formData.location) {
        const selectedActivity = activities.find(a => a._id === formData.activityId);
        if (!selectedActivity) {
          throw new Error('找不到選擇的活動');
        }

        qrData = {
          type: 'attendance_checkin',
          activityId: formData.activityId,
          activityName: formData.activityName,
          location: formData.location,
          trainerId: selectedActivity.trainerId,
          trainerName: selectedActivity.trainerName,
          startTime: selectedActivity.startTime,
          endTime: selectedActivity.endTime,
          duration: selectedActivity.duration,
          generatedAt: new Date().toISOString(),
          generatedBy: user?.username || 'unknown'
        };
      } else {
        qrData = {
          type: 'attendance_checkin_demo',
          message: '這是簽到二維碼功能展示',
          description: '選擇活動後可生成對應的簽到二維碼',
          generatedAt: new Date().toISOString(),
          generatedBy: user?.username || 'unknown'
        };
      }

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCode(qrCodeDataUrl);
      setShowQrCode(true);
    } catch (error) {
      console.error('生成二維碼失敗:', error);
      alert('生成二維碼失敗，請重試');
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!memberValidation.member) {
      alert('❌ 請先確認會員信息有效');
      return;
    }

    if (memberValidation.error) {
      alert(`❌ ${memberValidation.error}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          contactInfo: formData.contactInfo,
          location: formData.location,
          activity: formData.activityName,
          activityId: formData.activityId,
          memberId: memberValidation.member._id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ 出席記錄已成功添加，會員配額已自動扣除！');
        router.push('/attendance');
      } else {
        alert(`❌ 添加失敗：${data.error}`);
      }
    } catch {
      alert('❌ 提交失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.contactInfo.trim() &&
    formData.location.trim() && formData.activityId.trim() &&
    availableLocations.length > 0 &&
    memberValidation.member &&
    !memberValidation.error;

  return {
    router,
    user,
    isSubmitting,
    availableLocations,
    activities,
    isLoadingActivities,
    formData,
    setFormData,
    memberValidation,
    qrCode,
    showQrCode,
    setShowQrCode,
    isGeneratingQr,
    handleChange,
    generateQrCode,
    handleSubmit,
    isFormValid
  };
}
