<template>
  <transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">&yen;{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
				  </div>
				  <div class="carcontrol-wrapper">
						<cartcontrol v-on:drop="drop" :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0" @click="addFirst($event)">
							加入购物车
						</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<span class="text">{{food.info}}</span>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect v-on:select="select" v-on:toggleContent="toggleContent" :ratings="food.ratings" :desc="desc" :only-content="onlyContent" :select-type="selectType"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img class="avatar" width="12" height="12" :src="rating.avatar">
								</div>
								<div class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">
							暂无评价
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll';
	import cartcontrol from '@/components/cartcontrol/cartcontrol.vue';
	import split from '@/components/split/split.vue';
	import ratingselect from '@/components/ratingslect/ratingselect.vue';
	import {formatDate} from '@/common/js/date.js';

	const ALL = 2;
	export default {
		props: {
			food: {
				type: Object
			}
		},
		data () {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		computed: {
		},
		methods: {
			needShow (type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			},
			select (type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			toggleContent (content) {
				this.onlyContent = content;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			drop (el) {
				this.$emit('drop', event.target);
			},
			show () {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			hide () {
				this.showFlag = false;
			},
			addFirst (event) {
				if (!event._constructed) {
					return;
				}
				this.$set(this.food, 'count', 1);
				this.$emit('drop', event.target);
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		},
		filters: {
			formatDate (time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "./food.styl"
</style>
