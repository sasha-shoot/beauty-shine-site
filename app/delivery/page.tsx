import { InfoPage, InfoCard } from "@/components/InfoPage";

export const metadata = { title: "Доставка і оплата — Beauty & Shine" };

const TruckIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="13" height="10" rx="1.5"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="18" cy="18.5" r="1.8"/></svg>;
const StoreIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6"/></svg>;
const BikeIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M12 17.5V14l-3-3 4-3 2 3h3"/></svg>;
const CardIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>;
const CashIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>;

export default function DeliveryPage() {
  return (
    <InfoPage
      eyebrow="Клієнтам"
      title={<>Доставка та <em>оплата</em></>}
      intro="Доставляємо догляд по всій Україні та Ізмаїлу. Оберіть зручний спосіб отримання й оплати — ми подбаємо про решту."
    >
      <h2 className="info-section-title">Способи доставки</h2>
      <div className="info-grid">
        <InfoCard icon={TruckIcon} title="Нова Пошта — по Україні">
          <p>Відправляємо на <b>відділення або поштомат</b> у будь-яке місто України.</p>
          <ul className="info-list">
            <li>Термін доставки — <b>1–3 робочі дні</b></li>
            <li>Вартість — за тарифами Нової Пошти</li>
            <li>Відправлення в день замовлення при оформленні до 14:00</li>
          </ul>
        </InfoCard>

        <InfoCard icon={StoreIcon} title="Самовивіз зі студії">
          <p>Заберіть замовлення особисто у нашій студії — <b>безкоштовно</b>.</p>
          <ul className="info-list">
            <li>ТЦ «Дельта», 2 поверх, Ізмаїл</li>
            <li>Пн–Пт: 9:00–20:00, Сб–Нд: 10:00–18:00</li>
            <li>Повідомимо, щойно замовлення буде готове</li>
          </ul>
        </InfoCard>

        <InfoCard icon={BikeIcon} title="Кур'єр по Ізмаїлу">
          <p>Доставимо замовлення <b>прямо до дверей</b> у межах міста.</p>
          <ul className="info-list">
            <li>Доставка в день замовлення або на зручний час</li>
            <li>Вартість і деталі узгоджуємо при підтвердженні</li>
            <li>Зручно, коли засоби потрібні швидко</li>
          </ul>
        </InfoCard>
      </div>

      <h2 className="info-section-title">Способи оплати</h2>
      <div className="info-grid info-grid-2">
        <InfoCard icon={CardIcon} title="Оплата карткою / переказом">
          <p>Зручно оплатити заздалегідь карткою або переказом на рахунок.</p>
          <ul className="info-list">
            <li>Реквізити надішлемо при підтвердженні замовлення</li>
            <li>Замовлення відправляється після надходження оплати</li>
          </ul>
        </InfoCard>

        <InfoCard icon={CashIcon} title="Оплата при отриманні">
          <p>Платіть, коли тримаєте товар у руках — післяплата або готівка.</p>
          <ul className="info-list">
            <li>Післяплата на Новій Пошті (+ комісія перевізника)</li>
            <li>Готівкою або карткою при самовивозі та кур'єру</li>
          </ul>
        </InfoCard>
      </div>

      <div className="info-note">
        <b>💜 Турбота про вас:</b> ми ретельно пакуємо кожне замовлення, щоб засоби доїхали в ідеальному стані. Якщо щось пошкодилось при пересиланні — звертайтесь, вирішимо.
      </div>
    </InfoPage>
  );
}
