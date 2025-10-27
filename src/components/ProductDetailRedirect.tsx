import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function ProductDetailRedirect() {
  const { productCode } = useParams<{ productCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (productCode) {
      navigate(`/en/products/${productCode}`, { replace: true });
    }
  }, [productCode, navigate]);

  return null;
}