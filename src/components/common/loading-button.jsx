const LoadingButton = ({ size = 'medium', className = '', fullScreen = false }) => {
    const sizeClasses = {
      small: 'w-5 h-5',
      medium: 'w-6 h-6',
      large: 'w-8 h-8',
    };
  
    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50" style={{ top: '64px' }}>
          <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 border-4 border-[#2363E3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }
  
    return (
      <div className={`inline-block ${sizeClasses[size]}`}>
        <div className="w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };

export default LoadingButton;