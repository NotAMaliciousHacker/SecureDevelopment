// pages/index.tsx
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`}}>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard! Access your profile by changing the URL or:</p>
      <br />
      <button><Link href="/users/[id]" as="/users/1">Go to My Profile</Link></button>
    </div>
  );
}

export default Home;
