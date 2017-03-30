<template>
  <div>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart"  :class="{'highlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">&yen;{{totalPrice}}</div>
				<div class="desc">另需配送费&yen;{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
 				<div class="pay" :class="payClass">
 					{{payDesc}}
 				</div>
			</div>
		</div>
		<div class="ball-container">
		  <transition-group  
		  v-on:before-enter="beforeEnter"
  		v-on:enter="enter"
 		  v-on:after-enter="afterEnter" 
 		  name="drop" tag="div">
			 <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
			 	 <div class="inner inner-hook"></div>
			 </div>
			</transition-group>
		</div>
		<div class="shopcart-list" :class="{'fold-enter-active':listShow,'fold-leave-active':!listShow}" >
			<div class="list-header">
				<h1 class="title">购物车</h1>
				<span class="empty" @click="empty">清空</span>
			</div>
			<div class="list-content" ref="listContent">
				<ul>
					<li class="food" v-for="food in selectFoods">
						<span class="name">{{food.name}}</span>
						<div class="price">
							<span>&yen;{{food.price*food.count}}</span>
						</div>
						<div class="cartcontrol-wrapper">
							<cartcontrol  v-on:drop="drop" :food="food"></cartcontrol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<transition name="fade">
		<div @click="toggleList" class="list-mask" v-show="listShow"></div>
	</transition>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
  import cartcontrol from '@/components/cartcontrol/cartcontrol.vue';
	export default {
		props: {
			selectFoods: {
				type: Array,
				default () {
					return [
						{
							price: 100,
							count: 1
						}
					];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBall: [],
				fold: true
			};
		},
		computed: {
			totalPrice () {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount () {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc () {
				if (this.totalPrice === 0) {
					return `¥${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差¥${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			payClass () {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow () {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop (el) {
				for (var i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBall.push(ball);
						return;
					}
				}
			},
			empty () {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			pay () {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				alert(`需支付${this.totalPrice + this.deliveryPrice}元`);
			},
			beforeEnter (el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter (el) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter (el) {
				let ball = this.dropBall.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				};
			},
			toggleList () {
				if (!this.totalCount) {
					return;
				}
				console.log(this.fold);
				this.fold = !this.fold;
			}
		},
		components: {
			cartcontrol
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import "../../common/stylus/mixin.styl"
  @import "./shopcart.styl"
</style>
