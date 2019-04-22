<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('works', function (Blueprint $table) {
            $table->increments('work_id');
            $table->integer("request_number");
            $table->string("requestee");
            $table->string("purpose");
            $table->unsignedInteger("w_deptId")->nullable();
            $table->unsignedInteger('w_userId')->nullable();
            $table->string('pre_remarks');
            $table->string('post_remarks');
            $table->date('date_requested');
            $table->foreign('w_deptId')->references('department_id')->on('departments');
            $table->foreign('w_userId')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('works');
    }
}
