import { InfoPage, InfoCard } from "@/components/InfoPage";

export const metadata = { title: "Повернення та обмін — Beauty & Shine" };

const CheckIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
const XIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const StepsIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Клієнтам"
      title={<>Повернення та <em>обмін</em></>}
      intro="Ми хочемо, щоб ви були задоволені покупкою. Якщо щось не підійшло — ось як це працює."
    >
      <div className="info-note info-note-accent">
        <b>Головне:</b> повернути або обміняти можна товар протягом <b>14 днів</b> з моменту отримання — за умови, що він <b>не розпакований</b>, у заводській упаковці, без слідів використання, зі збереженням товарного вигляду та пломб.
      </div>

      <div className="info-grid info-grid-2">
        <InfoCard icon={CheckIcon} title="Що можна повернути">
          <ul className="info-list info-list-ok">
            <li>Нерозпакований товар у заводській упаковці</li>
            <li>Зі збереженими пломбами та етикетками</li>
            <li>Без слідів використання та пошкоджень</li>
            <li>Протягом 14 днів після отримання</li>
            <li>За наявності чека або підтвердження замовлення</li>
          </ul>
        </InfoCard>

        <InfoCard icon={XIcon} title="Що повернути не вийде">
          <ul className="info-list info-list-no">
            <li>Розпакований чи використаний товар</li>
            <li>З порушеною пломбою або захисною плівкою</li>
            <li>Без упаковки або з пошкодженою упаковкою</li>
            <li>Після спливу 14 днів</li>
          </ul>
          <p className="info-small">Це вимога гігієни: косметичні засоби, які контактують зі шкірою, не підлягають поверненню після розпакування згідно з чинним законодавством.</p>
        </InfoCard>
      </div>

      <InfoCard icon={StepsIcon} title="Як оформити повернення">
        <ol className="info-steps">
          <li><b>Напишіть нам</b> у Telegram-бот або зателефонуйте протягом 14 днів і повідомте номер замовлення.</li>
          <li><b>Узгодьте деталі</b> — ми підкажемо, як зручніше повернути товар (самовивіз чи Нова Пошта).</li>
          <li><b>Надішліть товар</b> у первісному вигляді з упаковкою та пломбами.</li>
          <li><b>Отримайте кошти</b> — повертаємо вартість тим же способом, яким була оплата, після перевірки товару.</li>
        </ol>
      </InfoCard>

      <div className="info-note">
        <b>Товар приїхав пошкодженим або не той?</b> Це інша ситуація — одразу напишіть нам із фото, і ми замінимо товар або повернемо кошти за наш рахунок, без 14-денних обмежень.
      </div>
    </InfoPage>
  );
}
