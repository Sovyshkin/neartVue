<template>
  <div class="delivery-calculator">
    <h3>{{ $t('checkout.deliveryOptions') }}</h3>
    
    <div class="delivery-methods">
      <!-- Самовывоз -->
      <div 
        class="delivery-method" 
        :class="{ active: selectedMethod === 'pickup' }"
        @click="selectMethod('pickup')"
      >
        <div class="method-header">
          <input type="radio" :checked="selectedMethod === 'pickup'" />
          <span class="method-name">{{ $t('checkout.pickup') }}</span>
          <span class="method-price">{{ $t('checkout.free') }}</span>
        </div>
        <p class="method-description">{{ $t('checkout.pickupDescription') }}</p>
      </div>

      <!-- СДЭК пункт выдачи -->
      <div 
        class="delivery-method" 
        :class="{ active: selectedMethod === 'cdek_pvz' }"
        @click="selectMethod('cdek_pvz')"
      >
        <div class="method-header">
          <input type="radio" :checked="selectedMethod === 'cdek_pvz'" />
          <span class="method-name">{{ $t('checkout.cdekPvz') }}</span>
          <span class="method-price">
            от 300 ₽
          </span>
        </div>
        <p class="method-description">
          Доставка в пункт выдачи СДЭК. Срок: 2-5 дней
        </p>
        <div v-if="selectedMethod === 'cdek_pvz'" class="pvz-note">
          <p><strong>Примечание:</strong> Укажите предпочитаемый пункт выдачи СДЭК в комментарии к заказу или оставьте выбор удобного ПВЗ менеджеру.</p>
        </div>
      </div>

      <!-- СДЭК курьер до двери -->
      <div 
        class="delivery-method" 
        :class="{ active: selectedMethod === 'cdek_courier' }"
        @click="selectMethod('cdek_courier')"
      >
        <div class="method-header">
          <input type="radio" :checked="selectedMethod === 'cdek_courier'" />
          <span class="method-name">{{ $t('checkout.cdekCourier') }}</span>
          <span class="method-price">
            от 400 ₽
          </span>
        </div>
        <p class="method-description">
          Доставка курьером СДЭК по адресу. Срок: 2-5 дней
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps({
  city: {
    type: String,
    required: true
  },
  totalWeight: {
    type: Number,
    default: 1000 // граммы
  }
});

const emit = defineEmits(['update:deliveryData']);

const selectedMethod = ref('pickup');
const deliveryRates = ref({});
const selectedPvz = ref(null);

// Расчет стоимости доставки
const calculateDelivery = async () => {
  if (!props.city || props.city.length < 2) return;

  try {
    const response = await fetch(`http://localhost:1337/api/cdek/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_location: {
          city: 'Москва' // Город отправителя
        },
        to_location: {
          city: props.city
        },
        packages: [
          {
            weight: props.totalWeight,
            length: 30,
            width: 20,
            height: 10
          }
        ]
      })
    });

    const data = await response.json();
    console.log('CDEK расчет ответ:', data); // Для отладки
    
    if (data.success && data.tariffs) {
      // Обрабатываем тарифы
      data.tariffs.forEach(tariff => {
        if (tariff.tariff_code === 136) { // Посылка склад-склад
          deliveryRates.value.cdek_pvz = {
            cost: tariff.delivery_sum,
            period_min: tariff.period_min,
            period_max: tariff.period_max
          };
        } else if (tariff.tariff_code === 137) { // Посылка склад-дверь
          deliveryRates.value.cdek_courier = {
            cost: tariff.delivery_sum,
            period_min: tariff.period_min,
            period_max: tariff.period_max
          };
        }
      });
    } else {
      console.error('Ошибка расчета CDEK:', data.error || 'Неизвестная ошибка');
    }
  } catch (error) {
    console.error('Ошибка расчета доставки:', error);
  }
};

// Выбор способа доставки
const selectMethod = (method) => {
  selectedMethod.value = method;
  updateDeliveryData();
};

// Обновление данных доставки для родительского компонента
const updateDeliveryData = () => {
  const deliveryData = {
    method: selectedMethod.value,
    cost: 0,
    pvzCode: null,
    pvzAddress: null
  };

  if (selectedMethod.value === 'pickup') {
    deliveryData.cost = 0;
  } else if (selectedMethod.value === 'cdek_pvz') {
    // Используем фиксированную цену или рассчитанную
    deliveryData.cost = deliveryRates.value.cdek_pvz?.cost || 300;
    if (selectedPvz.value) {
      deliveryData.pvzCode = selectedPvz.value.code;
      deliveryData.pvzAddress = selectedPvz.value.location.address_full;
    }
  } else if (selectedMethod.value === 'cdek_courier') {
    // Используем фиксированную цену или рассчитанную
    deliveryData.cost = deliveryRates.value.cdek_courier?.cost || 400;
  }

  emit('update:deliveryData', deliveryData);
};

// Пересчет при изменении города
watch(() => props.city, () => {
  deliveryRates.value = {};
  selectedPvz.value = null;
  calculateDelivery();
  updateDeliveryData();
}, { immediate: true });

watch(selectedMethod, updateDeliveryData);
</script>

<style scoped>
.delivery-calculator {
  margin: 30px 0;
}

.delivery-calculator h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.delivery-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delivery-method {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delivery-method:hover {
  border-color: #ccc;
}

.delivery-method.active {
  border-color: #000;
  background-color: #f9f9f9;
}

.method-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.method-header input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.method-name {
  flex: 1;
  font-weight: 600;
  font-size: 16px;
}

.method-price {
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.method-price.loading {
  color: #999;
  font-weight: 400;
  font-size: 14px;
}

.method-description {
  margin: 5px 0 0 28px;
  font-size: 14px;
  color: #666;
}

.pvz-note {
  margin: 10px 0 0 28px;
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 5px;
  font-size: 13px;
  color: #856404;
}

.pvz-note p {
  margin: 0;
}

.pvz-note strong {
  font-weight: 600;
}

.select-pvz-btn {
  margin: 10px 0 0 28px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.select-pvz-btn:hover {
  background-color: #333;
}
</style>
