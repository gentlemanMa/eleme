<template>
  <div class="goods">
		<div class="menu-wrapper" ref="menu">
		  <ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
				  <span class="text boderbottom">
				  	<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
				  	{{item.name}}
				  </span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foods">
			<ul>
		  	<li v-for="item in goods" class="food-list food-list-hook">
		  		<h1 class="title">{{item.name}}</h1>
		  		<ul>
		  			<li v-for="(food,index) in item.foods" class="food-item" @click="selectedFood(food,$event)" >
		  				<div class="icon">
		  					<img width="57" height="57" :src="food.icon">
		  				</div>
		  				<div class="content">
		  					<h2 class="name">{{food.name}}</h2>
		  					<p class="desc">{{food.description}}</p>
		  					<div class="extra">
		  						<span class="count">月售{{food.sellCount}}</span>
		  						<span>好评率{{food.rating}}</span>
		  					</div>
		  					<div class="price">
		  						<span class="now">&yen;{{food.price}}</span>
		  						<span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
		  					</div>
		  					<div class="cartcontrol-wrapper">
		  						<cartcontrol v-on:drop="_drop" :food="food"></cartcontrol>
		  					</div>
		  				</div>
		  			</li>
		  		</ul>
		  	</li>
		  </ul>
		</div>
		<shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice">
		</shopcart>
		<food v-on:drop="_drop"  :food="selectFood" ref="food"></food>
  </div>
</template>
<script>
	import Vue from 'vue';
  import BScroll from 'better-scroll';
  import shopcart from '@/components/shopcart/shopcart.vue';
  import cartcontrol from '@/components/cartcontrol/cartcontrol.vue';
  import food from '@/components/food/food.vue';
  const ERR_OK = 0;
  var eventHub = new Vue();
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectFood: {}
			};
		},
		computed: {
			currentIndex () {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i;
					};
				};
				return 0;
			},
			selectFoods () {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created () {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
				this.axios.get('/api/goods').then((res) => {
					res = res.data;
					if (res.errno === ERR_OK) {
						this.goods = res.data;
						this.$nextTick(() => {
							this._initScroll();
							this._calculateHeight();
						});
					};
			});
		},
		beforeDestroy: function () {
			eventHub.$off('addCart', this.addCart);
		},
		methods: {
			selectedFood (food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectFood = food;
				this.$refs.food.show();
			},
			selectMenu (index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$refs.foods.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
			},
			_initScroll () {
				this.menuScroll = new BScroll(this.$refs.menu, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foods, {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_drop (target) {
				this.$refs.shopcart.drop(target);
			},
			_calculateHeight () {
				let foodList = this.$refs.foods.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				};
			}
		},
		components: {
			shopcart,
			cartcontrol,
			food
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus">	
  @import "./goods.styl"
</style>
