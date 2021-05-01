<template>
  <div id="list">
  	<ul style="padding-left: 0px">
  		<li v-for="item in admins" v-bind:key="item" :class="{ active: currentSession ? item.username === currentSession:false}"
			v-on:click="changecurrentSession(item)">
  			<img class="avatar" :src="item.userFace" :alt="item.name">
  			<p class="name">{{item.name}}</p>
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      
    }
  },
  computed: mapState([
		  'admins',
		  'currentSession'
	]),
  methods:{
  	changecurrentSession:function (currentSession) {
  		this.$store.commit('changecurrentSession',currentSession)
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
		padding: 0px 15px;
		border-bottom: 1px solid #292C33;
		cursor: pointer;
		&:hover {
			background-color: rgba(239, 255, 2, 0.38);
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: rgba(239, 255, 2, 0.59);
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
		display: inline-block;
		margin-left: 15px;
		font-size: small;
	}
}
</style>
