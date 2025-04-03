import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { verifyMentor } from '@/redux/features/auth/MentorVerify';

const MentorLoadingPage: React.FC = () => {
    console.log('mentorverifiation pageil njan undlloooooooooooooooo');
    
  const { status, error } = useAppSelector((state: RootState) => state.mentor);
  const navigate = useNavigate();
 const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch verifyMentor when component mounts
    dispatch(verifyMentor());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
        setTimeout(()=>{
            navigate('/mentor'); 
        },5000)
    } else if (status === 'failed' && error) {
      navigate('/profile', { state: { error } }); 
    }
  }, [status, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Verifying Mentor Status</h2>
        <p className="text-gray-500 mt-2">Please wait while we check your credentials...</p>
      </div>
    </div>
  );
};

export default MentorLoadingPage;