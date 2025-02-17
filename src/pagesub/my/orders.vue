<template>
<view class="page">
    <!-- 订单类型切换 -->
    <view class="tabs">
        <view 
            class="tab-item" 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="{ active: currentTab === index }"
            @click="handleTabChange(index)"
        >
            <text>{{tab.name}}</text>
            <text class="count" v-if="tab.count">({{tab.count}})</text>
        </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list">
        <view class="order-item" v-for="(order, index) in orderList" :key="index">
            <view class="order-header">
                <view class="left">
                    <text class="order-type">{{order.type}}</text>
                    <text class="order-time">{{order.time}}</text>
                </view>
                <text class="order-status" :class="order.status">{{order.statusText}}</text>
            </view>
            <view class="order-content">
                <view class="goods-info">
                    <image :src="order.image" mode="aspectFill" class="goods-image"></image>
                    <view class="goods-detail">
                        <view class="goods-name">{{order.name}}</view>
                        <view class="goods-desc">{{order.desc}}</view>
                    </view>
                </view>
                <view class="price-info">
                    <text class="price">¥{{order.price}}</text>
                    <text class="count">x{{order.count}}</text>
                </view>
            </view>
            <view class="order-footer">
                <view class="total">
                    共{{order.count}}件商品 合计：
                    <text class="amount">¥{{order.total}}</text>
                </view>
                <view class="action-buttons">
                    <view class="btn" v-for="(btn, btnIndex) in order.buttons" :key="btnIndex"
                        :class="{ primary: btn.primary }"
                        @click="handleOrderAction(order, btn.action)"
                    >{{btn.text}}</view>
                </view>
            </view>
        </view>
    </scroll-view>
</view>
</template>

<script setup>
import { ref } from 'vue'

// 标签页数据
const tabs = ref([
    { name: '全部', count: 8 },
    { name: '待付款', count: 2 },
    { name: '待发货', count: 1 },
    { name: '待收货', count: 3 },
    { name: '已完成', count: 2 }
])

const currentTab = ref(0)

// 订单列表数据
const orderList = ref([
    {
        id: 1,
        type: '商品订单',
        time: '2024-01-16 15:30:21',
        status: 'pending',
        statusText: '待付款',
        image: '/static/images/goods/demo1.jpg',
        name: '测试商品名称商品名称商品名称',
        desc: '规格：默认',
        price: '99.00',
        count: 1,
        total: '99.00',
        buttons: [
            { text: '取消订单', action: 'cancel' },
            { text: '立即付款', action: 'pay', primary: true }
        ]
    },
    {
        id: 2,
        type: '商品订单',
        time: '2024-01-16 14:20:11',
        status: 'shipping',
        statusText: '待收货',
        image: '/static/images/goods/demo2.jpg',
        name: '测试商品名称商品名称商品名称',
        desc: '规格：默认',
        price: '199.00',
        count: 2,
        total: '398.00',
        buttons: [
            { text: '查看物流', action: 'logistics' },
            { text: '确认收货', action: 'confirm', primary: true }
        ]
    }
])

// 切换标签
function handleTabChange(index) {
    currentTab.value = index
    // TODO: 根据标签加载对应订单数据
}

// 处理订单操作
function handleOrderAction(order, action) {
    console.log('Order action:', action, order)
    switch(action) {
        case 'cancel':
            uni.showModal({
                title: '提示',
                content: '确定要取消该订单吗？',
                success: (res) => {
                    if (res.confirm) {
                        // TODO: 调用取消订单接口
                    }
                }
            })
            break
        case 'pay':
            uni.showToast({ title: '跳转支付...', icon: 'none' })
            break
        case 'logistics':
            uni.navigateTo({ url: `/pagesub/order/logistics?id=${order.id}` })
            break
        case 'confirm':
            uni.showModal({
                title: '提示',
                content: '确认已收到商品？',
                success: (res) => {
                    if (res.confirm) {
                        // TODO: 调用确认收货接口
                    }
                }
            })
            break
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
}

.tabs {
    display: flex;
    background: #fff;
    padding: 0 30rpx;
    position: sticky;
    top: 0;
    z-index: 100;

    .tab-item {
        flex: 1;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #666;
        position: relative;

        .count {
            font-size: 24rpx;
            margin-left: 4rpx;
        }

        &.active {
            color: #f32b99;
            font-weight: 500;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40rpx;
                height: 4rpx;
                background: #f32b99;
                border-radius: 2rpx;
            }
        }
    }
}

.order-list {
    flex: 1;
    padding: 20rpx 30rpx;
}

.order-item {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .left {
            .order-type {
                font-size: 28rpx;
                color: #333;
                margin-right: 20rpx;
            }

            .order-time {
                font-size: 24rpx;
                color: #999;
            }
        }

        .order-status {
            font-size: 28rpx;

            &.pending {
                color: #f32b99;
            }

            &.shipping {
                color: #ff9500;
            }

            &.completed {
                color: #52c41a;
            }
        }
    }

    .order-content {
        display: flex;
        margin-bottom: 20rpx;

        .goods-info {
            flex: 1;
            display: flex;

            .goods-image {
                width: 140rpx;
                height: 140rpx;
                border-radius: 12rpx;
                margin-right: 20rpx;
            }

            .goods-detail {
                flex: 1;

                .goods-name {
                    font-size: 28rpx;
                    color: #333;
                    margin-bottom: 8rpx;
                }

                .goods-desc {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }

        .price-info {
            text-align: right;

            .price {
                font-size: 32rpx;
                color: #333;
                font-weight: 500;
            }

            .count {
                font-size: 24rpx;
                color: #999;
                margin-left: 8rpx;
            }
        }
    }

    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20rpx;
        border-top: 2rpx solid #f5f5f5;

        .total {
            font-size: 26rpx;
            color: #666;

            .amount {
                font-size: 32rpx;
                color: #333;
                font-weight: 500;
            }
        }

        .action-buttons {
            display: flex;
            gap: 20rpx;

            .btn {
                padding: 12rpx 30rpx;
                border-radius: 30rpx;
                font-size: 26rpx;
                border: 2rpx solid #ddd;
                color: #666;

                &.primary {
                    background: #f32b99;
                    color: #fff;
                    border: none;
                }
            }
        }
    }
}
</style> 