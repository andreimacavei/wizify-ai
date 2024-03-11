import { kv } from '@vercel/kv';
import { client } from '../../lib/redis';

const getDomains = async () => {
  const response = await client.smembers('domains');

  return response;
};

export default async function Login() {
  const user = await kv.get('user');
  const domains = await getDomains();

  return (
    <>
      <div>Hello {user}!</div>

      <p>Available domains</p>
      <ul>
        {domains.map((domain) => (
          <li key={domain}>{domain}</li>
        ))}
      </ul>
    </>
  );
}
