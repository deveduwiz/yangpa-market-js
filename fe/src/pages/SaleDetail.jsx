import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, imageUrl } from '../api';

const won = (n) => `${Number(n).toLocaleString('ko-KR')}원`;

export default function SaleDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', sale: null, error: '' });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await api.getSale(id);
        // be의 GET /sales/:id 는 findAll이라 배열로 돌려준다
        const sale = Array.isArray(data.data)
          ? data.data[0]
          : data.data;
        if (!alive) return;
        setState(
          sale
            ? { status: 'done', sale, error: '' }
            : { status: 'error', sale: null, error: '상품을 찾을 수 없습니다.' },
        );
      } catch (err) {
        if (alive) setState({ status: 'error', sale: null, error: err.message });
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (state.status === 'loading') return <p className="muted">불러오는 중...</p>;
  if (state.status === 'error')
    return (
      <div className="stack">
        <p className="alert alert--error">{state.error}</p>
        <Link to="/sales" className="btn btn--ghost">
          목록으로
        </Link>
      </div>
    );

  const { sale } = state;

  return (
    <div className="stack">
      <Link to="/sales" className="link-back">
        ← 목록으로
      </Link>

      <article className="detail">
        <img
          src={imageUrl(sale.photo)}
          alt={sale.title}
          className="detail__img"
        />
        <div className="detail__body">
          <h1>{sale.title}</h1>
          <p className="detail__price">{won(sale.price)}</p>
          <p className="detail__desc">{sale.description}</p>
          <dl className="detail__meta">
            <div>
              <dt>판매자</dt>
              <dd>{sale.email}</dd>
            </div>
            <div>
              <dt>등록일</dt>
              <dd>{new Date(sale.createdAt).toLocaleString('ko-KR')}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
