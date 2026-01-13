const Skeleton = ({ className }) => {
    return (
        <div className={`bg-gray-700/50 animate-pulse rounded-xl ${className}`} />
    );
};

export default Skeleton;
