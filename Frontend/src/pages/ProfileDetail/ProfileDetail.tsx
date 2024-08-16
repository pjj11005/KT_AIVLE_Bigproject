import React, { useState, useRef, useEffect } from 'react';
import styles from './ProfileDetail.module.scss';
import { FaCheck } from 'react-icons/fa';
import { getProfile, Profile, patchProfile } from 'api/profile';
import { postPassword } from 'api/password';
import { APIResponse } from 'interface/commonResponse';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/auth/authSlice';
import { User } from '../../types';

const ProfileDetail: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [profileImage, setProfileImage] = useState<string>(
    profile?.avatar || '/image/user.png',
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const user = {
    isOnline: true,
    rating: 4.5,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setLoading(false);
        if (data?.avatar && data?.avatar !== undefined) {
          setProfileImage((prev) => 'http://localhost:8000' + data.avatar);
        }
      } catch (err) {
        setError('프로필 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCurrentPasswordCheck = () => {
    setIsPasswordCorrect(true);
    setIsEditing(true);
    setPasswordError('');
  };

  const handlePasswordChange = async () => {
    if (newPassword1 !== newPassword2) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword1.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    try {
      const response: APIResponse<any> = await postPassword({
        old_password: currentPassword,
        new_password1: newPassword1,
        new_password2: newPassword2,
      });

      if (response.statusCode === 200) {
        setPasswordError('비밀번호가 성공적으로 변경되었습니다.');
        setIsEditing(false);
        setIsPasswordCorrect(false);
        setCurrentPassword('');
        setNewPassword1('');
        setNewPassword2('');
      } else {
        setPasswordError(
          response.message ||
            '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
        );
      }
    } catch (error) {
      setPasswordError('비밀번호 변경 중 오류가 발생했습니다.');
      console.error('Password change error:', error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const updatedProfile = await patchProfile(formData);

          if (updatedProfile && updatedProfile.avatar) {
            setProfile(updatedProfile);
            const newImageUrl = `http://localhost:8000${updatedProfile.avatar}`;
            setProfileImage(newImageUrl);
            dispatch(setUser(updatedProfile as User));
          } else {
            throw new Error('Updated profile or avatar URL is missing');
          }
        } catch (error: unknown) {
          console.error('Error updating profile image:', error);
          if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
          } else if (error instanceof Error) {
            console.error('Error message:', error.message);
          }
          alert('사진 변경에 실패했습니다. 콘솔을 확인해주세요.');
        }
      } else {
        alert('Please select only PNG or JPEG images.');
        e.target.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (error) return <div style={{ marginLeft: '1rem' }}>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;
  const firstName = profile.name ? profile.name.charAt(0) : 'U';
  const lastName = profile.name ? profile.name.slice(1) : 'ser';
  return (
    <div className={styles['profile-detail-wrapper']}>
      <div
        className={`${styles['user-name-container']} ${styles['base-style']}`}
      >
        <div className={styles['image-container']}>
          <img
            className={styles['user-image']}
            src={profileImage}
            alt={profile?.name + "'s profile image"}
          />
          <button className={styles['camera-icon']} onClick={triggerFileInput}>
            <img src="/icon/camera.png" alt="Change profile picture" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
          />
        </div>
        <div className={styles['user-name-role-container']}>
          <span>{profile.name || 'User'}</span>
          <span>{profile.role}</span>
        </div>
      </div>
      <div
        className={`${styles['user-info-container']} ${styles['base-style']}`}
      >
        <div className={styles['personal-info-top']}>
          <span>Personal Info</span>
        </div>

        <div className={styles['personal-info-container']}>
          <div className={styles['row1']}>
            <div className={styles['col']}>
              <span>First Name</span>
              <span>{firstName}</span>
            </div>
            <div className={styles['col']}>
              <span>Email Address</span>
              <span>{profile.email}</span>
            </div>
            <div className={styles['col']}>
              <span>Role</span>
              <span>{profile.role}</span>
            </div>
          </div>
          <div className={styles['row2']}>
            <div className={styles['col']}>
              <span>Last Name</span>
              <span>{lastName}</span>
            </div>
            <div className={styles['col']}>
              <span>Set Password</span>
              <div className={styles['password-change']}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                />
                {!isPasswordCorrect && (
                  <button
                    onClick={handleCurrentPasswordCheck}
                    className={styles['check-btn']}
                  >
                    확인
                  </button>
                )}
                {isPasswordCorrect && (
                  <>
                    <input
                      type="password"
                      value={newPassword1}
                      onChange={(e) => setNewPassword1(e.target.value)}
                      placeholder="새 비밀번호"
                    />
                    <input
                      type="password"
                      value={newPassword2}
                      onChange={(e) => setNewPassword2(e.target.value)}
                      placeholder="새 비밀번호 확인"
                    />
                    <button
                      onClick={handlePasswordChange}
                      className={styles['save-btn']}
                    >
                      <FaCheck fontSize="1rem" />
                    </button>
                  </>
                )}
                {passwordError && (
                  <p className={styles.error}>{passwordError}</p>
                )}
              </div>
            </div>
            <div className={styles['col']}>
              <span>Phone Number</span>
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
