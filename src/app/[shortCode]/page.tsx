import { redirect } from 'next/navigation';
import { getOriginalUrl } from '../../utils/api';
import ClientRedirect from '../../components/ClientRedirect';

export default async function ShortUrlRedirect({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params;
  try {
    console.log(`Fetching original URL for shortCode: ${shortCode}`);
    const originalUrl = await getOriginalUrl(shortCode);
    console.log(`Original URL found: ${originalUrl}`);
    
    if (originalUrl) {
      console.log(`Redirecting to: ${originalUrl}`);
      return <ClientRedirect url={originalUrl} />;
    } else {
      console.log('No original URL found, redirecting to 404 page');
      redirect('/404');
    }
  } catch (error) {
    console.error('Error during redirection:', error);
    redirect('/404');
  }
}