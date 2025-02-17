<template>
<view class="page">
    <!-- 团队统计 -->
    <view class="header">
        <view class="total-card">
            <view class="title">团队总人数</view>
            <view class="amount">128</view>
            <view class="date">更新时间：2024-01-16 16:00:00</view>
        </view>
        <view class="stat-row">
            <view class="stat-item">
                <text class="value">23</text>
                <text class="label">今日新增</text>
            </view>
            <view class="stat-item">
                <text class="value">89</text>
                <text class="label">本月新增</text>
            </view>
            <view class="stat-item">
                <text class="value">¥3,688</text>
                <text class="label">团队收益</text>
            </view>
        </view>
    </view>

    <!-- 团队成员 -->
    <view class="team-container">
        <view class="section-header">
            <text class="title">团队成员</text>
            <view class="filter">
                <text class="current">默认排序</text>
                <u-icon name="arrow-down" size="24" color="#666"></u-icon>
            </view>
        </view>

        <view class="member-list">
            <view class="member-item" v-for="(member, index) in memberList" :key="index">
                <view class="member-info">
                    <u-avatar :text="member.name.slice(0,1)" size="80rpx" randomBgColor></u-avatar>
                    <view class="info">
                        <view class="name-row">
                            <text class="name">{{member.name}}</text>
                            <text class="level">{{member.level}}</text>
                        </view>
                        <view class="join-time">加入时间：{{member.joinTime}}</view>
                    </view>
                </view>
                <view class="member-stats">
                    <view class="stat">
                        <text class="value">{{member.teamCount}}</text>
                        <text class="label">团队人数</text>
                    </view>
                    <view class="stat">
                        <text class="value">¥{{member.contribution}}</text>
                        <text class="label">贡献收益</text>
                    </view>
                </view>
            </view>
        </view>
    </view>

    <!-- 邀请按钮 -->
    <view class="invite-btn" @click="handleInvite">
        <u-icon name="plus" color="#fff" size="32"></u-icon>
        <text>邀请新成员</text>
    </view>
</view>
</template>

<script setup>
import { ref } from 'vue'

// 团队成员列表
const memberList = ref([
    {
        name: '张三',
        level: '黄金会员',
        joinTime: '2024-01-15',
        teamCount: 12,
        contribution: '1,288.00'
    },
    {
        name: '李四',
        level: '白金会员',
        joinTime: '2024-01-14',
        teamCount: 28,
        contribution: '2,366.00'
    },
    {
        name: '王五',
        level: '普通会员',
        joinTime: '2024-01-13',
        teamCount: 5,
        contribution: '688.00'
    }
])

// 邀请新成员
function handleInvite() {
    uni.showModal({
        title: '邀请新成员',
        content: '分享您的邀请码给好友即可邀请加入',
        confirmText: '复制邀请码',
        success: (res) => {
            if (res.confirm) {
                uni.setClipboardData({
                    data: '1234567890',
                    success: () => {
                        uni.showToast({
                            title: '邀请码已复制',
                            icon: 'success'
                        })
                    }
                })
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 120rpx;
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

            .value {
                font-size: 32rpx;
                font-weight: 500;
                display: block;
                margin-bottom: 8rpx;
            }

            .label {
                font-size: 24rpx;
                opacity: 0.9;
            }
        }
    }
}

.team-container {
    margin: -20rpx 30rpx 0;
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;

    .section-header {
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
}

.member-list {
    .member-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 2rpx solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }

        .member-info {
            display: flex;
            align-items: center;

            .info {
                margin-left: 20rpx;

                .name-row {
                    margin-bottom: 8rpx;

                    .name {
                        font-size: 30rpx;
                        color: #333;
                        margin-right: 12rpx;
                    }

                    .level {
                        font-size: 22rpx;
                        color: #f32b99;
                        background: rgba(243, 43, 153, 0.1);
                        padding: 4rpx 12rpx;
                        border-radius: 20rpx;
                    }
                }

                .join-time {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }

        .member-stats {
            text-align: right;

            .stat {
                margin-bottom: 8rpx;

                &:last-child {
                    margin-bottom: 0;
                }

                .value {
                    font-size: 28rpx;
                    color: #333;
                    font-weight: 500;
                    margin-right: 8rpx;
                }

                .label {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }
    }
}

.invite-btn {
    position: fixed;
    bottom: 40rpx;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #f32b99, #ff6b6b);
    color: #fff;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    padding: 0 60rpx;
    box-shadow: 0 8rpx 16rpx rgba(243, 43, 153, 0.2);

    text {
        margin-left: 12rpx;
    }
}
</style> 