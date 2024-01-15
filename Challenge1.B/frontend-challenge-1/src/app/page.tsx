// pages/index.tsx
import Link from 'next/link';

const Home: React.FC = () => {
  const users = [
    {'id': '6d640be2-a3ed-4b9e-9130-2bd4b8822e0a', 'name': 'Alice'},
    {'id': '8079c8b7-11fd-4f05-9780-e2d9bf1e006f', 'name': 'Bob'},
    {'id': '38590b67-e0cf-4a1c-bb0c-0155beea4731', 'name': 'Charlie'}
  ]
  return (
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`}}>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard! Access your profile by changing the URL or:</p>
      <br />
      <button><Link href="/users/[id]" as="/users/6d640be2-a3ed-4b9e-9130-2bd4b8822e0a">Go to My Profile</Link></button>
      <br />
      <p style={{marginTop: '1%'}}>Other users</p>
      <ul>
        {users.map((user) => {
          return(
            <li id={user.id} key={user.id}>{user.name}</li>
          )
        })}
      </ul>
    </div>
  );
}

export default Home;
