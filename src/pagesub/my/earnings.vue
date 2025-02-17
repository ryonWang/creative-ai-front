<template>
<view class="page">
    <!-- 头部统计 -->
    <view class="header">
        <view class="total-card">
            <view class="title">总收益(元)</view>
            <view class="amount">2,358.50</view>
            <view class="date">统计时间：2024-01-01 至 2024-01-16</view>
        </view>
        <view class="stat-row">
            <view class="stat-item">
                <text class="label">今日收益</text>
                <text class="value">¥128.50</text>
            </view>
            <view class="stat-item">
                <text class="label">本月收益</text>
                <text class="value">¥1,288.00</text>
            </view>
            <view class="stat-item">
                <text class="label">上月收益</text>
                <text class="value">¥3,266.00</text>
            </view>
        </view>
    </view>

    <!-- 收益列表 -->
    <view class="list-container">
        <view class="list-header">
            <text class="title">收益明细</text>
            <view class="filter">
                <text class="current">全部</text>
                <u-icon name="arrow-down" size="24" color="#666"></u-icon>
            </view>
        </view>

        <view class="list">
            <view class="list-item" v-for="(item, index) in earningsList" :key="index">
                <view class="item-left">
                    <view class="type">{{item.type}}</view>
                    <view class="time">{{item.time}}</view>
                </view>
                <view class="item-right">
                    <view class="amount" :class="{ 'income': item.amount > 0 }">
                        {{item.amount > 0 ? '+' : ''}}{{item.amount}}
                    </view>
                    <view class="status">{{item.status}}</view>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const earningsList = ref([
    {
        type: '推广收益',
        time: '2024-01-16 15:30:21',
        amount: 58.50,
        status: '已到账'
    },
    {
        type: '团队分红',
        time: '2024-01-16 14:20:11',
        amount: 128.00,
        status: '已到账'
    },
    {
        type: '直推奖励',
        time: '2024-01-16 12:10:05',
        amount: 88.00,
        status: '已到账'
    },
    {
        type: '提现',
        time: '2024-01-15 18:30:00',
        amount: -500.00,
        status: '提现成功'
    },
    {
        type: '推广收益',
        time: '2024-01-15 16:25:33',
        amount: 66.00,
        status: '已到账'
    }
])
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 40rpx;
}

.header {
    background: linear-gradient(180deg, #f32b99, #ff6b6b);
    padding: 40rpx 30rpx;
    color: #fff;

    .total-card {
        text-align: center;
        margin-bottom: 40rpx;

        .title {
            font-size: 28rpx;
            opacity: 0.9;
        }

        .amount {
            font-size: 72rpx;
            font-weight: bold;
            margin: 20rpx 0;
        }

        .date {
            font-size: 24rpx;
            opacity: 0.8;
        }
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16rpx;
        padding: 30rpx;

        .stat-item {
            flex: 1;
            text-align: center;
            position: relative;

            &:not(:last-child)::after {
                content: '';
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 2rpx;
                height: 40rpx;
                background: rgba(255, 255, 255, 0.2);
            }

            .label {
                font-size: 24rpx;
                opacity: 0.9;
                display: block;
                margin-bottom: 12rpx;
            }

            .value {
                font-size: 32rpx;
                font-weight: 500;
            }
        }
    }
}

.list-container {
    margin: -20rpx 30rpx 0;
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;

    .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }

        .filter {
            display: flex;
            align-items: center;
            color: #666;
            font-size: 28rpx;

            .current {
                margin-right: 8rpx;
            }
        }
    }

    .list {
        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            border-bottom: 2rpx solid #f5f5f5;

            &:last-child {
                border-bottom: none;
            }

            .item-left {
                .type {
                    font-size: 30rpx;
                    color: #333;
                    margin-bottom: 8rpx;
                }

                .time {
                    font-size: 24rpx;
                    color: #999;
                }
            }

            .item-right {
                text-align: right;

                .amount {
                    font-size: 36rpx;
                    color: #333;
                    margin-bottom: 8rpx;

                    &.income {
                        color: #f32b99;
                    }
                }

                .status {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }
    }
}
</style> 