<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" @click.stop.prevent="deleteCart($event)" v-show="foods.count>0">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{foods.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div> 
</template>
<script>
	export default {
		props: {
			food: {
				type: Object
			}
		},
		computed: {
			foods () {
				let foods = this.food;
				return foods;
			}
		},
		created () {

		},
		methods: {
			addCart (event) {
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					this.$set(this.food, 'count', 1);
				} else {
					this.food.count++;
				}
				this.$emit('drop', event.target);
			},
			deleteCart (event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>
<style  lang="stylus" rel="stylesheet/stylus" scoped>
	.cartcontrol
		font-size:0
		.cart-decrease
			display:inline-block
			padding:6px
			.inner
				display:inline-block
				font-size:24px
				line-height:24px
				color:rgb(0,160,220)
		.move-enter-active,.move-leave-active
			opacity:1
			transform:translate3D(0,0,0)
			transition: all 0.4s linear
			.inner
				transform:rotate(0)
				transition: all 0.4s linear
		.move-enter,.move-leave-active
			opacity:0
			transform:translate3D(24px,0,0)
			.inner
				transform:rotate(180deg)
		.cart-count
			display:inline-block
			vertical-align:top
			width:12px
			padding-top:6px
			line-height:24px;
			text-align: center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			padding:6px
			font-size:24px
			line-height:24px
			color:rgb(0,160,220)
</style>
